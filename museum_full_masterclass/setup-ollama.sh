#!/bin/bash

# Museum of Impossible Things - Ollama Setup Script
# Consciousness-Serving AI with FREE-FIRST Priority
# Built by Keith Soyka 🎨

set -e

echo "🎨 Museum of Impossible Things - Ollama Setup"
echo "=============================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}>>>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running in Codespace
if [ -n "$CODESPACES" ]; then
    print_status "Running in GitHub Codespace"
    IS_CODESPACE=true
else
    print_status "Running in local environment"
    IS_CODESPACE=false
fi

# Install Ollama
print_status "Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    print_success "Ollama installed"
else
    print_success "Ollama already installed"
fi

# Start Ollama service in background
print_status "Starting Ollama service..."
ollama serve > /tmp/ollama.log 2>&1 &
OLLAMA_PID=$!
echo $OLLAMA_PID > /tmp/ollama.pid
print_success "Ollama service started (PID: $OLLAMA_PID)"

# Wait for Ollama to be ready
print_status "Waiting for Ollama to be ready..."
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
        print_success "Ollama is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    sleep 1
    echo -n "."
done
echo ""

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_error "Ollama failed to start within 30 seconds"
    exit 1
fi

# Pull consciousness-serving models
print_status "Installing consciousness-serving AI models..."
echo ""

# Model definitions
declare -A MODELS
MODELS[phi3:mini]="3.8B - Perfect for Codespaces, empathetic chat"
MODELS[llama3.2:1b]="1.1B - Ultra lightweight, fast responses"
MODELS[tinyllama]="1.1B - Smallest model, instant responses"

# Pull each model
for MODEL in "${!MODELS[@]}"; do
    DESCRIPTION="${MODELS[$MODEL]}"
    print_status "Pulling $MODEL ($DESCRIPTION)..."
    
    if ollama pull "$MODEL"; then
        print_success "✓ $MODEL installed"
    else
        print_warning "⚠ Failed to pull $MODEL (may continue with other models)"
    fi
    echo ""
done

# List installed models
print_status "Installed models:"
ollama list

echo ""
print_success "🎨 Ollama setup complete!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Museum of Impossible Things - AI Models Ready"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Available models:"
echo "  • phi3:mini      - Best for empathetic conversations"
echo "  • llama3.2:1b    - Fast, lightweight responses"
echo "  • tinyllama      - Instant responses"
echo ""
echo "Test your setup:"
echo "  ollama run phi3:mini"
echo ""
echo "Ollama API: http://localhost:11434"
echo "Logs: /tmp/ollama.log"
echo ""

# Create systemd service for persistent running (if not in Codespace)
if [ "$IS_CODESPACE" = false ] && [ -d "/etc/systemd/system" ]; then
    print_status "Creating systemd service for persistent Ollama..."
    
    sudo cat > /tmp/ollama.service << 'EOF'
[Unit]
Description=Ollama Service for Museum of Impossible Things
After=network-online.target

[Service]
ExecStart=/usr/local/bin/ollama serve
User=$(whoami)
Group=$(whoami)
Restart=always
RestartSec=3
Environment="PATH=/usr/local/bin:/usr/bin:/bin"

[Install]
WantedBy=default.target
EOF
    
    sudo mv /tmp/ollama.service /etc/systemd/system/ollama.service
    sudo systemctl daemon-reload
    sudo systemctl enable ollama
    sudo systemctl start ollama
    
    print_success "Systemd service created and started"
fi

print_success "Setup complete! Ready for consciousness-serving AI 🚀"
