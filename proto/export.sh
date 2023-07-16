# !bin/sh

npx buf generate
npx buf export . --output ../hero-api/src/proto
npx buf export . --output ../user-api/src/proto
npx buf export . --output ../auth-api/src/proto
npx buf export . --output ../rdv-api/src/proto
