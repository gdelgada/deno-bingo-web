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

Deno.serve({ port: PORT }, (req) => {
	return serveDir(req, {
		fsRoot: publicDir,
		urlRoot: '',
		showDirListing: false,
		enableCors: true,
	});
});
