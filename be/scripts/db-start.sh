#!/bin/bash

# Move to the project root directory
echo "Current directory: $(pwd)"

# Start the docker container containing the database
docker-compose up --build -d

# Wait for the database to be ready
# To be shure the database is up and correctly running, we'll try to ping
# the database until it's ready to accept connections
until docker ps | grep -q "pp_db"; do
  echo "Waiting for postgres to be ready..."
  sleep 1
done

# Wait for redis service to be ready
until docker ps | grep -q "pp_redis"; do
  echo "Waiting for redis to be ready..."
  sleep 1
done

# Once both the database and redis are ready, we'll check if there are any migrations to run
if npx knex migrate:status | grep -q "Pending Migration"; then
  echo "Running migrations..."
  npx knex migrate:latest
else
  echo "No migrations to run"
fi