#!/bin/bash
# Museum of Impossible Things - Dev Container Setup

set -e

echo "🎨 Setting up Museum of Impossible Things..."

# Update pip
python -m pip install --upgrade pip

# Install core Python dependencies
pip install --no-cache-dir \
    fastapi>=0.100.0 \
    uvicorn[standard]>=0.23.0 \
    pydantic>=2.0.0 \
    pydantic-settings>=2.0.0 \
    motor>=3.2.0 \
    pymongo>=4.5.0 \
    python-dotenv>=1.0.0 \
    httpx>=0.24.0 \
    requests>=2.31.0 \
    pytest>=7.0.0 \
    pytest-asyncio>=0.21.0

echo "✓ Python dependencies installed"

# Install Node dependencies if frontend exists
if [ -d "frontend" ]; then
    echo "Installing Node.js dependencies..."
    cd frontend && npm install --legacy-peer-deps && cd ..
    echo "✓ Node.js dependencies installed"
fi

# Git LFS
git lfs install

# Forest green prompt
echo 'export PS1="\[\033[38;5;28m\]🎨\[\033[00m\] \w \$ "' >> ~/.bashrc

echo ""
echo "✅ Development environment ready!"
echo "🌲 Forest Green theme active"
echo ""
