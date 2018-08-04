#!/usr/bin/env sh
node script/migrator.js
git add .
git commit -m "chore: Update migrator"
yarn release
git push origin master --tags
yarn deploy