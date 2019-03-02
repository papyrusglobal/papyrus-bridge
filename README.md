# Papyrus Token Bridge Oracle services

This repository is a fork of [POA Bridge v1.1.0](https://github.com/poanetwork/token-bridge/tree/1.1.0).

It will be very useful to read [POA Bridge documentation](https://github.com/poanetwork/token-bridge/blob/1.1.0/README.md). It describes how the bridge works in commom and which types of work it implements.

# How to use

To use oracle services it is necessary to configure file [papyrus/papyrus-bridge.env](papyrus/papyrus-bridge.env) and run docker container. To do that you need have [Docker](https://docs.docker.com/install/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

File [papyrus/papyrus-bridge.env](papyrus/papyrus-bridge.env) itself contains comments to each variable all of them are also explaned in [POA Bridge documentation]([https://github.com/poanetwork/token-bridge/blob/1.1.0/README.md](https://github.com/poanetwork/token-bridge/blob/1.1.0/README.md#configuration-parameters)).

To run oracle services just run script [papyrus/start-services.sh](papyrus/start-services.sh) with set up environment variables `VALIDATOR_ADDRESS` and `VALIDATOR_ADDRESS_PRIVATE_KEY`:

```sh
VALIDATOR_ADDRESS=0xab...ef \
VALIDATOR_ADDRESS_PRIVATE_KEY=<ab..ef> \
COMPOSE_PROJECT_NAME=<validator> \
papyrus/start-services.sh
```

where:

- `VALIDATOR_ADDRESS` - Ethereum address of authorized oracle validator
- `VALIDATOR_ADDRESS_PRIVATE_KEY` - private key of Ethereum address of authorized oracle validator
- `COMPOSE_PROJECT_NAME` - optional compose project name used when multiple oracles are run on the same host (default `validator`)

To stop oracle services run script [papyrus/stop-services.sh](papyrus/start-services.sh).

```sh
papyrus/stop-services.sh
```

There is also script for test run three oracles on the same host stored in scripts [papyrus/start-services-test.sh](papyrus/start-services-test.sh) and [papyrus/stop-services-test.sh](papyrus/stop-services-test.sh).
