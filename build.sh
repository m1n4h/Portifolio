#!/usr/bin/env bash
# exit on error
set -o errexit

# Upgrade pip first
pip install --upgrade pip

# Install Python dependencies
pip install -r requirements.txt

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Copy frontend build into Django for WhiteNoise serving
rm -rf backend/frontend_dist
cp -r frontend/dist backend/frontend_dist

echo "Build complete!"
