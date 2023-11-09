# OpenAI API Status Prober

WORK IN PROGRESS! Stay tuned.


## Systemd service

1. Copy the `openai_api_status_prober.service` file to `/etc/systemd/system/`.
2. Reload the systemd daemon to recognize the new service: `sudo systemctl daemon-reload`
3. Enable the service to start on boot: `sudo systemctl enable openai_api_status_prober.service`
4. Start the service: `sudo systemctl start openai_api_status_prober.service`
5. Check the status to ensure it's running: `sudo systemctl status openai_api_status_prober.service`