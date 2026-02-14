#!/bin/bash

# Docker startup script for tokn-app
# Usage: ./scripts/start-docker.sh [dev|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not available. Please install Docker Compose plugin."
        exit 1
    fi
}

setup_environment() {
    print_info "Setting up environment..."
    
    # Check if .env.local exists, if not create from .env.docker
    if [ ! -f .env.local ]; then
        print_warning ".env.local not found, creating from .env.docker..."
        cp .env.docker .env.local
        print_info "Please update .env.local with your actual configuration"
    fi
    
    # Create necessary directories
    mkdir -p docker/postgres
    mkdir -p docker/localstack
    
    # Create PostgreSQL initialization script
    if [ ! -f docker/postgres/init.sql ]; then
        cat > docker/postgres/init.sql << EOF
-- PostgreSQL initialization script for tokn-app
CREATE DATABASE IF NOT EXISTS tokn;
GRANT ALL PRIVILEGES ON DATABASE tokn TO postgres;
EOF
    fi
    
    # Create LocalStack initialization script
    if [ ! -f docker/localstack/init.sh ]; then
        cat > docker/localstack/init.sh << 'EOF'
#!/bin/bash
# LocalStack initialization script
set -e

echo "Initializing LocalStack..."

# Create S3 bucket
awslocal s3 mb s3://tokn-app-bucket
awslocal s3api put-bucket-acl --bucket tokn-app-bucket --acl public-read

echo "LocalStack initialization completed."
EOF
        chmod +x docker/localstack/init.sh
    fi
}

start_development() {
    print_info "Starting development environment..."
    
    # Build and start all services
    docker compose up -d --build
    
    # Wait for services to be ready
    print_info "Waiting for services to be ready..."
    sleep 10
    
    # Run database migrations
    print_info "Running database migrations..."
    docker compose exec app npx prisma migrate dev
    
    # Generate Prisma client
    print_info "Generating Prisma client..."
    docker compose exec app npx prisma generate
    
    print_success "Development environment started!"
    echo ""
    echo "Services:"
    echo "  • Next.js App: http://localhost:3000"
    echo "  • PostgreSQL: localhost:5432 (user: postgres, password: postgres)"
    echo "  • Redis: localhost:6379"
    echo "  • Stripe CLI: Listening on port 3000/webhooks"
    echo "  • LocalStack (AWS S3): http://localhost:4566"
    echo "  • Supabase Studio: http://localhost:8080"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

start_production() {
    print_info "Starting production environment..."
    
    # Build production image
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    
    print_success "Production environment started!"
    echo ""
    echo "Services:"
    echo "  • Next.js App: http://localhost:3000"
    echo "  • PostgreSQL: localhost:5432"
    echo "  • Redis: localhost:6379"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
}

stop_environment() {
    print_info "Stopping environment..."
    docker compose down
    print_success "Environment stopped."
}

clean_environment() {
    print_info "Cleaning environment (removing volumes)..."
    docker compose down -v
    print_success "Environment cleaned."
}

show_status() {
    print_info "Checking service status..."
    docker compose ps
}

show_logs() {
    print_info "Showing logs..."
    docker compose logs -f
}

show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development environment (default)"
    echo "  prod      Start production environment"
    echo "  stop      Stop all services"
    echo "  clean     Stop and remove volumes"
    echo "  status    Show service status"
    echo "  logs      Show service logs"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development environment"
    echo "  $0 prod     # Start production environment"
    echo "  $0 status   # Check service status"
}

main() {
    check_docker
    
    COMMAND=${1:-"dev"}
    
    case $COMMAND in
        dev)
            setup_environment
            start_development
            ;;
        prod)
            setup_environment
            start_production
            ;;
        stop)
            stop_environment
            ;;
        clean)
            clean_environment
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Unknown command: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

main "$@"