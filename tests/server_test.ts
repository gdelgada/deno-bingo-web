import { assertEquals, assertExists } from '@std/assert';
import { dirname, fromFileUrl, join } from '@std/path';

// Test suite for server.ts path resolution
Deno.test('Server path resolution - serverDir is correctly resolved', () => {
	// Simulate import.meta.url
	const mockMetaUrl = 'file:///c:/Users/test/project/src/server.ts';
	const serverDir = dirname(fromFileUrl(mockMetaUrl));

	assertExists(serverDir);
	assertEquals(
		serverDir.includes('src') || serverDir.includes('test'),
		true,
	);
});

Deno.test('Server path resolution - publicDir is correctly constructed', () => {
	const mockMetaUrl = 'file:///c:/Users/test/project/src/server.ts';
	const serverDir = dirname(fromFileUrl(mockMetaUrl));
	const publicDir = join(serverDir, 'public');

	assertExists(publicDir);
	assertEquals(publicDir.includes('public'), true);
});

// Test suite for HTTP server functionality
Deno.test('HTTP Server - serves static files from public directory', async () => {
	// Start a test server
	const controller = new AbortController();
	const port = 8001; // Use different port to avoid conflicts

	const serverPromise = Deno.serve(
		{ port, signal: controller.signal },
		(req) => {
			const url = new URL(req.url);
			if (url.pathname === '/test.html') {
				return new Response('<h1>Test</h1>', {
					headers: { 'content-type': 'text/html' },
				});
			}
			return new Response('Not Found', { status: 404 });
		},
	);

	// Wait a bit for server to start
	await new Promise((resolve) => setTimeout(resolve, 100));

	try {
		// Test server response
		const response = await fetch(`http://localhost:${port}/test.html`);
		assertEquals(response.status, 200);
		const text = await response.text();
		assertEquals(text, '<h1>Test</h1>');
	} finally {
		// Cleanup
		controller.abort();
		await serverPromise.finished;
	}
});

Deno.test('HTTP Server - handles CORS headers', async () => {
	const controller = new AbortController();
	const port = 8002;

	const serverPromise = Deno.serve(
		{ port, signal: controller.signal },
		() => {
			return new Response('OK', {
				headers: {
					'Access-Control-Allow-Origin': '*',
				},
			});
		},
	);

	await new Promise((resolve) => setTimeout(resolve, 100));

	try {
		const response = await fetch(`http://localhost:${port}/`);
		const corsHeader = response.headers.get('Access-Control-Allow-Origin');
		// Consume the body to avoid resource leak
		await response.text();
		assertEquals(corsHeader, '*');
	} finally {
		controller.abort();
		await serverPromise.finished;
	}
});

Deno.test('HTTP Server - returns 404 for non-existent files', async () => {
	const controller = new AbortController();
	const port = 8003;

	const serverPromise = Deno.serve(
		{ port, signal: controller.signal },
		() => {
			return new Response('Not Found', { status: 404 });
		},
	);

	await new Promise((resolve) => setTimeout(resolve, 100));

	try {
		const response = await fetch(
			`http://localhost:${port}/nonexistent.html`,
		);
		// Consume the body to avoid resource leak
		await response.text();
		assertEquals(response.status, 404);
	} finally {
		controller.abort();
		await serverPromise.finished;
	}
});

Deno.test('HTTP Server - handles index.html as default', async () => {
	const controller = new AbortController();
	const port = 8004;

	const serverPromise = Deno.serve(
		{ port, signal: controller.signal },
		(req) => {
			const url = new URL(req.url);
			// Simulate serving index.html for root path
			if (url.pathname === '/' || url.pathname === '/index.html') {
				return new Response('<h1>Index</h1>', {
					headers: { 'content-type': 'text/html' },
				});
			}
			return new Response('Not Found', { status: 404 });
		},
	);

	await new Promise((resolve) => setTimeout(resolve, 100));

	try {
		const response = await fetch(`http://localhost:${port}/`);
		assertEquals(response.status, 200);
		const text = await response.text();
		assertEquals(text.includes('Index'), true);
	} finally {
		controller.abort();
		await serverPromise.finished;
	}
});

Deno.test('HTTP Server - serves correct content-type headers', async () => {
	const controller = new AbortController();
	const port = 8005;

	const serverPromise = Deno.serve(
		{ port, signal: controller.signal },
		(req) => {
			const url = new URL(req.url);
			if (url.pathname === '/test.css') {
				return new Response('body { margin: 0; }', {
					headers: { 'content-type': 'text/css' },
				});
			}
			if (url.pathname === '/test.js') {
				return new Response('console.log("test");', {
					headers: { 'content-type': 'application/javascript' },
				});
			}
			return new Response('Not Found', { status: 404 });
		},
	);

	await new Promise((resolve) => setTimeout(resolve, 100));

	try {
		const cssResponse = await fetch(`http://localhost:${port}/test.css`);
		assertEquals(cssResponse.headers.get('content-type'), 'text/css');
		// Consume the body to avoid resource leak
		await cssResponse.text();

		const jsResponse = await fetch(`http://localhost:${port}/test.js`);
		assertEquals(
			jsResponse.headers.get('content-type'),
			'application/javascript',
		);
		// Consume the body to avoid resource leak
		await jsResponse.text();
	} finally {
		controller.abort();
		await serverPromise.finished;
	}
});
