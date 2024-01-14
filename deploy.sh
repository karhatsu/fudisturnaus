#!/usr/bin/env bash
set -e

npm run lint
./run-tests.sh
git push heroku master
heroku run rake db:migrate

git push origin master
