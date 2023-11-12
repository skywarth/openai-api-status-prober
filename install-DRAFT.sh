#!/bin/bash

# Constants
SERVICE_FILE="openai_api_status_prober.service"
REPO_PATH="$(pwd)"  # Assumes the script is run from the repo root
APP_PATH="$REPO_PATH/app"
SERVICE_PATH="/etc/systemd/system/$SERVICE_FILE"
APP_SYMLINK="/usr/local/bin/openai_api_status_prober_app"

# Ensure running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Check if Node.js is installed
#if ! command -v node > /dev/null 2>&1; then
#  echo "Node.js is not installed. Please install Node.js before running this script."
#  exit 1
#fi

# Check if the symlink for the app directory already exists
if [ ! -L "$APP_SYMLINK" ]; then
  echo "Creating symlink for the app directory..."
  ln -s "$APP_PATH" "$APP_SYMLINK"
else
  echo "Symlink for the app directory already exists."
fi

# Install Node.js dependencies in the app directory
cd "$APP_PATH" || exit
echo "Installing Node.js dependencies..."
npm install

# Copy the service file to the systemd directory
if [ ! -f "$SERVICE_PATH" ]; then
  echo "Copying the service file..."
  cp "$REPO_PATH/service/$SERVICE_FILE" "$SERVICE_PATH"
  # Reload systemd to recognize the new service file
  systemctl daemon-reload
else
  echo "Service file already exists."
fi

# Enable and start the service
systemctl enable openai_api_status_prober
systemctl restart openai_api_status_prober

echo "Installation completed successfully!"