# Museum of Impossible Things - Backend Dockerfile
# FINAL, FOOLPROOF VERSION V3

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PYTHONPATH=/app

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc g++ curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY backend/ .

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && \
    chown -R app:app /app
USER app

# Expose the port Railway will assign
EXPOSE 8000

# REVERTED FIX: Use the "shell form" of CMD to ensure $PORT is expanded by the shell.
# This is the key change that will fix the current error.
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
