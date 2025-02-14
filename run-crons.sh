#!/bin/bash

# Set the base URL for your local development server
BASE_URL="http://localhost:3000/api/cron"

# Function to call a cron route
call_cron() {
    echo "Calling $1..."
    curl -X GET "$BASE_URL/$1" &
}

# Main loop
while true; do
    call_cron "email"
    call_cron "jobs"

    # Wait for both calls to complete
    wait

    echo "Waiting for 2 minutes..."
    sleep 120
done
