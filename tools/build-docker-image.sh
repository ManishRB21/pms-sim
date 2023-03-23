#!/usr/bin/env bash
npm run build

tar -czvf pms.tar.gz \
      dist \
      resource \
      tools/cli-entrypoint.sh \
      tools/scripts \
      tools/webpack.config.js \
      src \
      package.json \
      LICENSE.txt

docker build -t pms .

rm pms.tar.gz
