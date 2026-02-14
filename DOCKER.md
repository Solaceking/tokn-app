# Docker Setup for Tokns App

This directory contains Docker configuration for running the Tokns application in both development and production environments.

## Quick Start

### Prerequisites
- Docker installed (with Docker Compose plugin)
- Node.js 20+ (for local development without Docker)

### Development Environment

1. **Setup environment variables:**
   ```bash
   cp .env.docker .env.local
   # Edit .env.local with your actual configuration
   ```

2. **Start development services:**
   ```bash
   chmod +x scripts/start-docker.sh
   ./scripts/start-docker.sh dev
   ```

   Or manually:
   ```bash
   docker compose up -d
   ```

3. **Access services:**
   - Next.js App: http://localhost:3000
   - PostgreSQL: localhost:5432 (user: `postgres`, password: `postgres`)
   - Redis: localhost:6379
   - Stripe CLI: Listening on port 3000/webhooks
   - LocalStack (AWS S3): http://localhost:4566
   - Supabase Studio: http://localhost:8080

### Production Environment

1. **Set production environment variables:**
   ```bash
   cp .env.docker .env.production
   # Edit .env.production with production values
   ```

2. **Build and start production services:**
   ```bash
   ./scripts/start-docker.sh prod
   ```

   Or manually:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
   ```

## Docker Files Overview

### `Dockerfile`
Multi-stage Dockerfile for production builds:
- **Build stage**: Installs dependencies, generates Prisma client, builds Next.js app
- **Production stage**: Uses Alpine base image with non-root user for security

### `Dockerfile.dev`
Development Dockerfile with:
- Node.js 20 Alpine base
- Development dependencies installed
- Hot reload enabled
- Debug port exposed (9229)

### `docker-compose.yml`
Main Docker Compose configuration with:
- Next.js application (port 3000)
- PostgreSQL database (port 5432)
- Redis for caching (port 6379)
- Stripe CLI for webhook testing
- LocalStack for AWS S3 simulation (port 4566)
- Supabase Studio for database management (port 8080)

### `docker-compose.override.yml`
Development-specific overrides:
- Volume mounts for live code reloading
- Development environment variables
- Debug port exposure
- Development volume naming

### `docker-compose.prod.yml`
Production-specific configuration:
- Production-optimized PostgreSQL settings
- Redis authentication
- Health checks
- Production volume naming
- Resource limits

### `.env.docker`
Docker-specific environment variables with:
- Database connection strings
- Redis configuration
- Stripe test keys
- Supabase local emulation
- AWS S3 LocalStack setup
- Application secrets (change in production!)

### `scripts/start-docker.sh`
Convenience script with:
- Environment setup
- Service health checks
- Database migrations
- Service status display
- Log viewing

## Database Setup

### Initial Migration
When starting for the first time, the script automatically runs:
```bash
docker-compose exec app npx prisma migrate dev
docker-compose exec app npx prisma generate
```

### Manual Database Operations
```bash
# Access PostgreSQL shell
docker compose exec db psql -U postgres -d tokns

# Run migrations manually
docker compose exec app npx prisma migrate dev

# Reset database
docker compose exec app npx prisma migrate reset

# Generate Prisma client
docker compose exec app npx prisma generate
```

## Service Management

### Common Commands
```bash
# Start development environment
./scripts/start-docker.sh dev

# Start production environment
./scripts/start-docker.sh prod

# Stop all services
./scripts/start-docker.sh stop

# Stop and remove volumes
./scripts/start-docker.sh clean

# Check service status
./scripts/start-docker.sh status

# View logs
./scripts/start-docker.sh logs
```

### Manual Docker Compose Commands
```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# View specific service logs
docker compose logs -f app

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v

# Rebuild specific service
docker compose up -d --build app

# Execute command in container
docker compose exec app npm run lint
docker compose exec db psql -U postgres -d tokns
```

## Health Checks

Services include health checks:
- **App**: HTTP GET `/api/health`
- **PostgreSQL**: `pg_isready`
- **Redis**: `redis-cli ping`

## Production Considerations

### Security
1. **Change all default passwords** in `.env.production`
2. **Generate secure encryption keys**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. **Use SSL/TLS** for database connections in production
4. **Set proper file permissions** for mounted volumes

### Monitoring
Add to `docker-compose.prod.yml`:
```yaml
app:
  logging:
    driver: "json-file"
    options:
      max-size: "10m"
      max-file: "3"
```

### Backups
```bash
# Backup PostgreSQL
docker-compose exec db pg_dump -U postgres tokns > backup.sql

# Backup Redis
docker-compose exec redis redis-cli --rdb dump.rdb
```

## Troubleshooting

### Common Issues

**Database connection refused:**
```bash
# Check if PostgreSQL is running
docker-compose ps db

# Check logs
docker-compose logs db

# Restart services
docker-compose restart db app
```

**App not starting:**
```bash
# Check Node.js version compatibility
docker-compose exec app node --version

# Check dependencies
docker-compose exec app npm list

# Rebuild
docker-compose up -d --build app
```

**Volume permissions:**
```bash
# Fix volume permissions
sudo chown -R 1001:1001 docker/postgres_data
```

### Cleaning Up
```bash
# Remove all containers, networks, and volumes
docker-compose down -v --remove-orphans

# Remove unused Docker resources
docker system prune -af
```

## Environment Variables Reference

See `.env.docker` for all available variables. Key variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@db:5432/tokns` |
| `REDIS_URL` | Redis connection string | `redis://redis:6379` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | `http://localhost:54321` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Test key |
| `ENCRYPTION_KEY` | 64-character hex encryption key | Generated |
| `STRIPE_SECRET_KEY` | Stripe secret key | Test key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Test secret |
| `NEXTAUTH_SECRET` | NextAuth.js secret | Generated |
| `AWS_S3_ENDPOINT` | AWS S3 endpoint | `http://localhost:4566` |

## Support

For issues:
1. Check Docker logs: `docker-compose logs`
2. Verify environment variables
3. Ensure ports are not already in use
4. Check Docker resource allocation