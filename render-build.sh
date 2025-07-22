#!/usr/bin/env bash
# Build script for deploying on Render
set -e

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies
npm install --prefix frontend

# Build the frontend
npm run build --prefix frontend
