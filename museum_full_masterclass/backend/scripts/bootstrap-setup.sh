#!/bin/bash
# /scripts/bootstrap-setup.sh

echo "🚀 GestaltView Bootstrap Setup - FREE AI Models"
echo "================================================="

# Check system requirements
echo "📋 Checking system requirements..."

# Install Ollama
echo "🦙 Installing Ollama..."
if ! command -v ollama &> /dev/null; then
    curl -fsSL https://ollama.com/install.sh | sh
    echo "✅ Ollama installed successfully"
else
    echo "✅ Ollama already installed"
fi

# Start Ollama service
echo "🔄 Starting Ollama service..."
ollama serve &
sleep 5

# Install consciousness-serving models
echo "🧠 Installing consciousness-serving AI models..."

echo "📥 Installing Phi-3 Mini (3.8B) - Fast and efficient..."
ollama pull phi3:mini

echo "📥 Installing Llama 3.2 1B - Ultra lightweight..."
ollama pull llama3.2:1b

echo "📥 Installing Mistral 7B - Excellent reasoning..."
ollama pull mistral:7b

echo "📥 Installing CodeLlama 7B - For development assistance..."
ollama pull codellama:7b

# Verify installations
echo "🔍 Verifying model installations..."
ollama list

# Install Python dependencies for local HuggingFace
echo "🤗 Setting up HuggingFace transformers..."
pip install transformers torch accelerate

# Download lightweight HF models
echo "📥 Downloading local HuggingFace models..."
python3 << EOF
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Download lightweight models for offline use
models = [
    "microsoft/DialoGPT-medium",
    "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
]

for model_name in models:
    print(f"📥 Downloading {model_name}...")
    try:
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModelForCausalLM.from_pretrained(model_name)
        print(f"✅ {model_name} ready")
    except Exception as e:
        print(f"⚠️ {model_name} failed: {e}")

print("🎉 Local HuggingFace models ready!")
EOF

# Create environment file
echo "⚙️ Creating bootstrap environment configuration..."
cat > .env.bootstrap << 'EOF'
# BOOTSTRAP CONFIGURATION - 100% FREE
OLLAMA_HOST=http://localhost:11434
HUGGINGFACE_LOCAL_CACHE=./models
ENABLE_PAID_APIS=false
ENABLE_PAID_FALLBACK=false

# Only enable these if you have credits/keys
# OPENAI_API_KEY=
# ANTHROPIC_API_KEY=
# HUGGINGFACE_API_KEY=

# Database (can use MongoDB free tier)
MONGODB_URI=mongodb+srv://your-free-cluster.mongodb.net/gestaltview

# Required for JWT
JWT_SECRET=your-bootstrap-jwt-secret-key-here

# Application settings
ENVIRONMENT=bootstrap
LOG_LEVEL=INFO
RATE_LIMIT_PER_MINUTE=30

# Vercel deployment
VERCEL_URL=museum-of-impossible-things-portfolio.vercel.app
NEXT_PUBLIC_API_URL=https://museum-of-impossible-things-portfolio.vercel.app/api
EOF

echo ""
echo "🎉 BOOTSTRAP SETUP COMPLETE!"
echo "================================"
echo ""
echo "✅ Ollama running with consciousness-serving models"
echo "✅ Local HuggingFace models downloaded" 
echo "✅ Zero monthly AI costs!"
echo ""
echo "💡 Next steps:"
echo "1. Copy .env.bootstrap to .env and customize"
echo "2. Set up free MongoDB Atlas cluster"
echo "3. Deploy to Vercel (free tier)"
echo ""
echo "🚀 Your consciousness-serving AI platform is ready!"
echo "Total monthly cost: $0.00 🎉"
