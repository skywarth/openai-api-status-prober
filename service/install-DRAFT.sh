#!/bin/bash

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

# Install Node.js if not installed
if ! command -v node > /dev/null; then
  echo "Node.js is not installed. Installing..."
  curl -sL https://deb.nodesource.com/setup_14.x | bash -
  apt-get install -y nodejs
fi

# Clone the repository (if your app is not meant to be cloned, skip this step)
git clone https://github.com/yourusername/openai_status_prober.git /opt/openai_status_prober

# Install dependencies
cd /opt/openai_status_prober
npm install

# Copy the service file and set permissions
cp /opt/openai_status_prober/openai_status_prober.service /etc/systemd/system/
chmod 644 /etc/systemd/system/openai_status_prober.service

# Reload systemd to use the new service file
systemctl daemon-reload

# Enable and start the service
systemctl enable openai_status_prober.service
systemctl start openai_status_prober.service

echo "Installation completed successfully!"