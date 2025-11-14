#!/bin/bash

# This script correctly starts the Uvicorn server,
# allowing Railway's $PORT variable to be used.

set -e

# Run the Uvicorn server
exec uvicorn main:app --host 0.0.0.0 --port $PORT
