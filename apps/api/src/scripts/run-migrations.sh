#!/bin/bash

# Load variables from the .env file, ignoring comments and empty lines
set -a
if [ -f .env ]; then
    source .env
else
    echo ".env file not found!"
    exit 1
fi
set +a

# Directory where the SQL files are located
SQL_DIR="../api"

# Se o argumento terminar com .sql, execute apenas o arquivo específico
if [[ "$1" == *.sql ]]; then
    FILE="$1"
    if [ ! -f "$FILE" ]; then
        echo "Migration file $FILE not found!"
        exit 1
    fi
    echo "Executing $FILE..."
    psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f "$FILE"
    if [ $? -ne 0 ]; then
        echo "Error executing $FILE. Stopping execution."
        exit 1
    fi
    echo "Migration $1 completed successfully."
    exit 0
fi

# Check if the argument passed is "up" or "down"
if [[ "$1" != "up" && "$1" != "down" ]]; then
    echo "Usage: $0 up | down | migration_file.sql"
    exit 1
fi

# Define the suffix and sorting order based on the argument
SUFFIX=".$1.sql"
ORDER="sort -V"
[[ "$1" == "down" ]] && ORDER="sort -Vr"

echo "Running $1 migrations..."

# Find and sort the SQL files with the correct suffix
FILES=$(find "$SQL_DIR" -type f -name "*$SUFFIX" | $ORDER)

# Loop to execute each SQL file
for file in $FILES; do
    echo "Executing $file..."
    psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -f "$file"
    if [ $? -ne 0 ]; then
        echo "Error executing $file. Stopping execution."
        exit 1
    fi
done

echo "Migrations $1 completed successfully."