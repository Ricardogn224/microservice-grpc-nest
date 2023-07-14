# !bin/sh

buf generate
buf export . --output ../hero-api/src/proto
buf export . --output ../user-api/src/proto
buf export . --output ../rdv-api/src/proto
