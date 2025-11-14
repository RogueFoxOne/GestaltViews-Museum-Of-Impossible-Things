# ============================================================================
# Museum of Impossible Things - Dev Container
# ============================================================================
# Forest Green & Midnight Blue themed development environment
# Built for consciousness-serving AI development
# ============================================================================

FROM mcr.microsoft.com/devcontainers/python:3.11

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    git \
    git-lfs \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Install Git LFS
RUN git lfs install

# Set working directory
WORKDIR /workspace

# Install Python dev tools
RUN pip install --upgrade pip \
    && pip install \
        black \
        isort \
        pylint \
        mypy \
        pytest \
        pytest-cov \
        ipython

# Set up forest green prompt
RUN echo 'export PS1="\[\033[38;5;28m\]🎨 Museum Dev\[\033[00m\] \[\033[38;5;39m\]\w\[\033[00m\]\$ "' >> /home/vscode/.bashrc

# Museum welcome message
RUN echo 'echo "🎨 Welcome to the Museum of Impossible Things Development Environment"' >> /home/vscode/.bashrc
RUN echo 'echo "✨ Forest Green & Midnight Blue Theme Active"' >> /home/vscode/.bashrc
RUN echo 'echo ""' >> /home/vscode/.bashrc
