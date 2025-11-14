#!/bin/bash
# start-museum.sh
# Artfully orchestrates the entire Museum of Impossible Things

set -e

echo "🎨 Museum of Impossible Things - Startup Sequence"
echo "=================================================="

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.template .env
    echo "📝 Please edit .env with your HuggingFace API key"
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Load environment
export $(cat .env | xargs)

echo ""
echo "🐳 Starting Docker containers..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🎭 Checking service health..."
docker-compose ps

echo ""
echo "✅ Museum is OPEN!"
echo "=================================================="
echo "📍 Backend API:  http://localhost:8000"
echo "📍 Frontend:     http://localhost:3000"
echo "📍 MongoDB:      mongodb://localhost:27017"
echo ""
echo "🎨 View API docs: http://localhost:8000/docs"
echo "🎭 View logs:     docker-compose logs -f"
echo ""
echo "🛑 To stop:       docker-compose down"
echo "=================================================="
