# !bin/sh

npx buf generate
npx buf export . --output ../../src/proto
