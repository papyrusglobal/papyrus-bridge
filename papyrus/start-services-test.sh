#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
ROOT_DIR="$( dirname "${SCRIPT_DIR}" )"

# Copy Papyrus bridge settings
cp ${SCRIPT_DIR}/papyrus-bridge.env ${ROOT_DIR}/.env

# Run Papyrus bridge services with private key of validator A
( \
    cd ${ROOT_DIR} && \
    VALIDATOR_ADDRESS=0x810b8e3B6584F13E7c08B79f6FA8440F1D915C5c \
    VALIDATOR_ADDRESS_PRIVATE_KEY=4fc55d24c010364699165a502441bcfcf4db91bf26a379eccefe45f9e65cb652 \
    COMPOSE_PROJECT_NAME=validator_a \
    docker-compose up -d --build \
)

# Run Papyrus bridge services with private key of validator B
( \
    cd ${ROOT_DIR} && \
    VALIDATOR_ADDRESS=0x801131D66CB05Ac530895c0FbDF3FA637BA2572a \
    VALIDATOR_ADDRESS_PRIVATE_KEY=55a24b9e584480f6fb19151b2485f99a3caa832d90267318edceb7683cc9de92 \
    COMPOSE_PROJECT_NAME=validator_b \
    docker-compose up -d --build \
)

# Run Papyrus bridge services with private key of validator C
( \
    cd ${ROOT_DIR} && \
    VALIDATOR_ADDRESS=0x5E125722714C7df3d1191A86ba891c7Adbc1A7dF \
    VALIDATOR_ADDRESS_PRIVATE_KEY=9b19f7449171e02cba3c9d3a3141f77aee677ff915d3806f8cac5e1bedd24a61 \
    COMPOSE_PROJECT_NAME=validator_c \
    docker-compose up -d --build \
)
