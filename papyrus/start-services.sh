#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
ROOT_DIR="$( dirname "${SCRIPT_DIR}" )"

# Copy Papyrus bridge settings
cp ${SCRIPT_DIR}/papyrus-bridge.env ${ROOT_DIR}/.env

# Assuming environment variables VALIDATOR_ADDRESS and VALIDATOR_ADDRESS_PRIVATE_KEY specified
cd ${ROOT_DIR} && docker-compose up -d --build
