#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
ROOT_DIR="$( dirname "${SCRIPT_DIR}" )"

# Assuming environment variables VALIDATOR_ADDRESS and VALIDATOR_ADDRESS_PRIVATE_KEY specified
cd ${ROOT_DIR} && docker-compose down
