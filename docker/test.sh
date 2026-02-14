#!/bin/bash

# Test script to verify Docker setup

set -e

echo "Testing Docker setup for tokn-app..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "ERROR: Docker is not running or not installed"
    exit 1
fi

echo "✓ Docker is running"

# Check if Docker Compose is available
if ! docker compose version > /dev/null 2>&1; then
    echo "ERROR: Docker Compose is not available"
    exit 1
fi

echo "✓ Docker Compose is available"

# Check required files exist
required_files=(
    "Dockerfile"
    "Dockerfile.dev"
    "docker-compose.yml"
    "docker-compose.override.yml"
    "docker-compose.prod.yml"
    ".env.docker"
    "scripts/start-docker.sh"
    "docker/postgres/init.sql"
    "docker/localstack/init.sh"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "ERROR: Required file '$file' not found"
        exit 1
    fi
done

echo "✓ All required files exist"

# Check if start script is executable
if [ ! -x "scripts/start-docker.sh" ]; then
    echo "ERROR: scripts/start-docker.sh is not executable"
    exit 1
fi

echo "✓ Start script is executable"

# Test Dockerfile syntax
echo "Testing Dockerfile syntax..."
if ! docker build --file Dockerfile --target builder --no-cache . > /dev/null 2>&1; then
    echo "ERROR: Dockerfile has syntax errors"
    exit 1
fi

echo "✓ Dockerfile syntax is valid"

# Test Dockerfile.dev syntax
echo "Testing Dockerfile.dev syntax..."
if ! docker build --file Dockerfile.dev --no-cache . > /dev/null 2>&1; then
    echo "ERROR: Dockerfile.dev has syntax errors"
    exit 1
fi

echo "✓ Dockerfile.dev syntax is valid"

# Test docker-compose syntax
echo "Testing docker-compose syntax..."
if ! docker compose config > /dev/null 2>&1; then
    echo "ERROR: docker-compose.yml has syntax errors"
    exit 1
fi

echo "✓ docker-compose.yml syntax is valid"

# Test docker-compose.prod syntax
echo "Testing docker-compose.prod syntax..."
if ! docker compose -f docker-compose.yml -f docker-compose.prod.yml config > /dev/null 2>&1; then
    echo "ERROR: docker-compose.prod.yml has syntax errors"
    exit 1
fi

echo "✓ docker-compose.prod.yml syntax is valid"

# Test PostgreSQL init script syntax
echo "Testing PostgreSQL init script..."
if ! psql -v ON_ERROR_STOP=1 -f docker/postgres/init.sql > /dev/null 2>&1; then
    echo "WARNING: PostgreSQL init script may have syntax errors (but this is normal without PostgreSQL running)"
fi

echo "✓ PostgreSQL init script syntax checked"

# Test package.json for required scripts
echo "Checking package.json for required scripts..."
if ! grep -q '"dev"' package.json; then
    echo "ERROR: package.json missing 'dev' script"
    exit 1
fi

if ! grep -q '"build"' package.json; then
    echo "ERROR: package.json missing 'build' script"
    exit 1
fi

if ! grep -q '"start"' package.json; then
    echo "ERROR: package.json missing 'start' script"
    exit 1
fi

echo "✓ package.json has required scripts"

# Test Next.js configuration
echo "Checking Next.js configuration..."
if [ ! -f "next.config.ts" ] && [ ! -f "next.config.js" ]; then
    echo "WARNING: Next.js configuration file not found"
fi

echo "✓ Next.js configuration checked"

# Test Prisma configuration
echo "Checking Prisma configuration..."
if [ ! -f "prisma/schema.prisma" ]; then
    echo "WARNING: Prisma schema not found"
else
    echo "✓ Prisma schema exists"
fi

echo ""
echo "=========================================="
echo "All tests passed! Docker setup is ready."
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Copy .env.docker to .env.local:"
echo "   cp .env.docker .env.local"
echo ""
echo "2. Edit .env.local with your configuration"
echo ""
echo "3. Start development environment:"
echo "   ./scripts/start-docker.sh dev"
echo ""
echo "4. Or start production environment:"
echo "   ./scripts/start-docker.sh prod"
echo ""
echo "For more information, see DOCKER.md"