#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --include=dev

echo "Building project..."
npx vite build
