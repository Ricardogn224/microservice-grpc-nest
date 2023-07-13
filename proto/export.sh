# !bin/sh

npx buf generate
npx buf export . --output ../hero-api/src/proto
npx buf export . --output ../user-api/src/proto
