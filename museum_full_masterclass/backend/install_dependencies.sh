#!/bin/bash
# Museum of Impossible Things - Install Dependencies
# Fix for missing FastAPI, dotenv, and starlette imports

echo "🎨 Museum of Impossible Things - Installing Dependencies"
echo "=========================================================================="
echo ""

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"
echo ""

# Upgrade pip first
echo "📦 Upgrading pip..."
python3 -m pip install --upgrade pip
echo ""

# Install core dependencies
echo "📦 Installing FastAPI and dependencies..."
python3 -m pip install \
    fastapi>=0.100.0 \
    uvicorn[standard]>=0.23.0 \
    python-dotenv>=1.0.0 \
    pydantic>=2.0.0 \
    pydantic-settings>=2.0.0 \
    starlette>=0.27.0

echo ""
echo "📦 Installing database dependencies..."
python3 -m pip install \
    motor>=3.2.0 \
    pymongo>=4.5.0

echo ""
echo "📦 Installing HTTP clients..."
python3 -m pip install \
    httpx>=0.24.0 \
    requests>=2.31.0 \
    aiohttp>=3.9.0

echo ""
echo "📦 Installing utilities..."
python3 -m pip install \
    python-multipart>=0.0.6 \
    loguru>=0.7.0 \
    pytest>=7.0.0 \
    pytest-asyncio>=0.21.0

echo ""
echo "=========================================================================="
echo "✅ All dependencies installed!"
echo ""
echo "Verify installation:"
python3 -c "import fastapi; print('✓ FastAPI:', fastapi.__version__)"
python3 -c "import dotenv; print('✓ python-dotenv installed')"
python3 -c "import starlette; print('✓ Starlette:', starlette.__version__)"
python3 -c "import motor; print('✓ Motor installed')"
echo ""
echo "Ready to run: python3 app.py"
