import { serveDir } from '@std/http/file-server';
import { dirname, fromFileUrl, join } from '@std/path';

const PORT = 8000;

// Get the directory where this server file is located (Windows-safe)
const serverDir = dirname(fromFileUrl(import.meta.url));
// Public directory is at the root of the project
const publicDir = Deno.env.get('PUBLIC_DIR') || join(serverDir, '../public');

console.log(`🎱 Bingo Master Web Server`);
console.log(`🌐 Server running at http://localhost:${PORT}/`);
console.log(`📂 Serving files from: ${publicDir}`);
console.log(
	`\n✨ Open your browser and navigate to http://localhost:${PORT}\n`,
);
console.log(
	`📱 To play with others, usethe computer's local IP address instead of localhost (e.g., http://192.168.1.X:${PORT})\n`,
);

// Socket Metadata Management
interface SocketMeta {
	roomId?: string;
	isHost?: boolean;
}

// Room Management
interface Room {
	id: string;
	host: WebSocket;
	clients: Set<WebSocket>;
}

const socketMeta = new Map<WebSocket, SocketMeta>();
const rooms = new Map<string, Room>();

function generateRoomId(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	do {
		result = '';
		for (let i = 0; i < 4; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
	} while (rooms.has(result));
	return result;
}

Deno.serve({ port: PORT }, (req) => {
	if (req.headers.get('upgrade') === 'websocket') {
		const { socket, response } = Deno.upgradeWebSocket(req);

		socket.onopen = () => {
			console.log('Client connected');
			socketMeta.set(socket, {});
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data) as {
					type: string;
					roomId?: string;
					payload?: unknown;
				};

				if (data.type === 'CREATE_ROOM') {
					const roomId = generateRoomId();
					rooms.set(roomId, {
						id: roomId,
						host: socket,
						clients: new Set(),
					});
					socketMeta.set(socket, { roomId, isHost: true });
					socket.send(
						JSON.stringify({ type: 'ROOM_CREATED', roomId }),
					);
					console.log(`Room created: ${roomId}`);
				} else if (data.type === 'JOIN_ROOM') {
					const roomId = data.roomId?.toUpperCase();
					const room = roomId ? rooms.get(roomId) : undefined;

					if (room && roomId) {
						room.clients.add(socket);
						socketMeta.set(socket, { roomId, isHost: false });
						socket.send(
							JSON.stringify({ type: 'JOINED_ROOM', roomId }),
						);
						console.log(`Client joined room: ${roomId}`);
						// Notify host to send state
						if (room.host.readyState === WebSocket.OPEN) {
							room.host.send(
								JSON.stringify({ type: 'PLAYER_JOINED' }),
							);
						}
					} else {
						socket.send(
							JSON.stringify({
								type: 'ERROR',
								message: 'Room not found',
							}),
						);
					}
				} else if (data.type === 'GAME_UPDATE') {
					// Host sending update
					const meta = socketMeta.get(socket);
					const roomId = meta?.roomId;

					if (roomId && rooms.has(roomId)) {
						const room = rooms.get(roomId);
						if (room && room.host === socket) {
							// Broadcast to all clients
							const broadcastData = JSON.stringify({
								type: 'GAME_UPDATE',
								payload: data.payload,
							});
							for (const client of room.clients) {
								if (client.readyState === WebSocket.OPEN) {
									client.send(broadcastData);
								}
							}
						}
					}
				}
			} catch (e) {
				console.error('Error handling message', e);
			}
		};

		socket.onclose = () => {
			const meta = socketMeta.get(socket);
			if (!meta) return;

			const { roomId, isHost } = meta;

			if (roomId && rooms.has(roomId)) {
				const room = rooms.get(roomId);
				if (isHost && room?.host === socket) {
					// Host left, notify clients and destroy room
					for (const client of room.clients) {
						try {
							client.send(
								JSON.stringify({ type: 'HOST_DISCONNECTED' }),
							);
						} catch { /* ignore */ }
					}
					rooms.delete(roomId);
					console.log(`Room destroyed: ${roomId}`);
				} else if (room) {
					// Client left
					room.clients.delete(socket);
				}
			}
			socketMeta.delete(socket);
		};

		return response;
	}

	return serveDir(req, {
		fsRoot: publicDir,
		urlRoot: '',
		showDirListing: false,
		enableCors: true,
	});
});
