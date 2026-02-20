#! /bin/bash

set -e 

pnpm build

rm -rf ../OpenList/public/dist/assets
rm -rf ../OpenList/public/dist/images
rm -rf ../OpenList/public/dist/static
rm -rf ../OpenList/public/dist/streamer
mv dist/* ../OpenList/public/dist/
