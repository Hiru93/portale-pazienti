#!/bin/bash

# Hwo current project directory
echo "Current directory: $(pwd)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MIGRATION_DIR="$SCRIPT_DIR/../migrations"

cd "$SCRIPT_DIR/.."

echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│                       MODULE NAMING RULES                       │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│  Keep the name as simple as possible. After sanitation,         │"
echo "│  it will be used as the component name and will be:             │"
echo "│                                                                 │"
echo "│    • Lowercase                                                  │"
echo "│    • Underscore separated                                       │"
echo "│    • No numbers or special characters (except underscores)      │"
echo "│                                                                 │"
echo "│  Example:  'Patient Records 1'  →  'patient_records'            │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo "Enter the name of the new module:"

while true; do
    read -p "Module name: " module_name

    # String sanitize process:
    #- Remove all underscores
    #- Replace all spaces with underscores
    #- Remove all characters that are not letters or underscores
    #- Transform the name to lowercase
    CLEAN=${module_name//_/}
    CLEAN=${CLEAN// /_}
    CLEAN=${CLEAN//[^a-zA-Z_]/}
    module_name=`echo $CLEAN | tr A-Z a-z`

    case $module_name in
        "")
            echo "Module name cannot be empty."
            ;;
        *)
            break
            ;;
    esac
done

echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│                    MODULE DESCRIPTION RULES                     │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│  Provide a brief description of the module. After sanitation,   │"
echo "│  only alphanumeric characters and spaces will be kept.          │"
echo "│                                                                 │"
echo "│  Example:  'Manages patient records & data!'                    │"
echo "│        →   'Manages patient records  data'                      │"
echo "└─────────────────────────────────────────────────────────────────┘"
read -p "Module description: " module_description

# Sanitize description: keep only alphanumeric characters and spaces
module_description=$(echo "$module_description" | tr -cd '[:alnum:] ')

echo "┌───────────────────────────────────────────────────────────────────┐"
echo "│                       MODULE NAMING RULES                         │"
echo "├───────────────────────────────────────────────────────────────────┤"
echo "│  Auth levels:                                                     │"
echo "│    2 - Operator                                                   │"
echo "│    3 - Patient                                                    │"
echo "│    4 - Specialist                                                 │"
echo "│                                                                   │"
echo "│  Ghost users with auth level 1 have default access to all modules │"
echo "└───────────────────────────────────────────────────────────────────┘"


while true; do
    read -p "Enter the auth levels required [2-4, space-separated]: " -a module_auth_level

    if [ ${#module_auth_level[@]} -eq 0 ]; then
        echo "Please enter at least one auth level."
        continue
    fi

    valid=true
    for level in "${module_auth_level[@]}"; do
        case $level in
            2|3|4) ;;
            *)
                echo "Invalid auth level '$level'. Please enter numbers between 2 and 4."
                valid=false
                break
                ;;
        esac
    done

    $valid && break
done

echo "Creating new module migration..."
levels_joined=$(IFS=_; echo "${module_auth_level[*]}")
levels_csv=$(IFS=,; echo "${module_auth_level[*]}" | sed 's/,/, /g')
cmd_output=$(npm run --silent migration:generate -- module_${module_name}_${levels_joined} 2>&1)

if [  $? -ne 0 ]; then
    echo "Error creating migration: $cmd_output"
    exit 1
fi

filepath=$(echo "$cmd_output" | grep -oE '/[^ ]+\.ts')
filename=$(basename "$filepath")

if [ -z "$filename" ]; then
    echo "Error: Could not extract migration filename from command output."
    exit 1
fi

echo "New migration created: $filename"

echo "Scaffolding the migration file..."

cat <<EOL > "$MIGRATION_DIR/$filename"
import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const roles = await knex<{ id: number }>('role')
    .select('id')
    .whereIn('id', [1, ${levels_csv}]);

  await knex('component').insert({
    name: '${module_name}',
    description: '${module_description}',
    roles: JSON.stringify(roles.map(r => r.id)),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex('component').where('name', '${module_name}').del();
}
EOL

echo "Migration file $filename has been created successfully."

while true; do
    read -p "Would you like to apply the migration now? [y/n]: " yn
    case $yn in
        [Yy])
            npm run migration:migrate
            break
            ;;
        [Nn])
            echo "You can apply the migration later by running 'npm run migration:migrate'."
            break
            ;;
        *)
            echo "Please answer y or n."
            ;;
    esac
done

exit 0