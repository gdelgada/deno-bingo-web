# Project Compilation

This guide explains how to compile the Bingo web application into a standalone executable.

## Basic Compilation

To compile the application for your current platform:

```bash
deno task compile
```

The executable will be created in `output/bingo-web` (or `bingo-web.exe` on Windows).

## Cross-Platform Compilation

### For Windows

```bash
deno compile --allow-net --allow-read --include public --target x86_64-pc-windows-msvc -o output/bingo-web-windows.exe src/server.ts
```

### For Linux

```bash
deno compile --allow-net --allow-read --include public --target x86_64-unknown-linux-gnu -o output/bingo-web-linux src/server.ts
```

### For macOS (Intel)

```bash
deno compile --allow-net --allow-read --include public --target x86_64-apple-darwin -o output/bingo-web-macos src/server.ts
```

### For macOS (Apple Silicon)

```bash
deno compile --allow-net --allow-read --include public --target aarch64-apple-darwin -o output/bingo-web-macos-arm src/server.ts
```

## Using the Executable

Once compiled, the executable includes:
- The HTTP server
- All static files (HTML, CSS, JS)
- Required Deno dependencies

To run it:

1. Navigate to the `output/` folder
2. Execute the binary:
   - **Windows**: `.\bingo-web.exe`
   - **Linux/macOS**: `./bingo-web` (may require permissions: `chmod +x bingo-web`)
3. Open your browser at: **http://localhost:8000**

## Required Permissions

The executable requires the following permissions:
- `--allow-net`: To start the HTTP server on port 8000
- `--allow-read`: To read static files from the `public/` folder

These permissions are embedded in the compiled executable.

## Available Targets

Deno supports the following compilation targets:

- `x86_64-pc-windows-msvc` - Windows 64-bit
- `x86_64-unknown-linux-gnu` - Linux 64-bit
- `x86_64-apple-darwin` - macOS Intel 64-bit
- `aarch64-apple-darwin` - macOS Apple Silicon (M1/M2)

## Notes

- The executable size can be ~100-150 MB as it includes the Deno runtime
- The executable is completely standalone and doesn't require Deno to be installed
- Files in `public/` are embedded in the executable
