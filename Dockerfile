FROM denoland/deno:2.6.3

# Create working directory
WORKDIR /app

# Copy dependency files first for better caching
COPY deno.json deno.lock ./

# Copy source code
COPY src/ ./src/
COPY public/ ./public/

# Cache dependencies by running a check
RUN deno cache src/server.ts

# Expose port (optional, documenta el puerto)
EXPOSE 8000

# Health check (opcional pero recomendado)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD deno eval "fetch('http://localhost:8000').catch(() => Deno.exit(1))"

# Run the app
CMD ["deno", "run", "--allow-env", "--allow-net", "--allow-read", "src/server.ts"]