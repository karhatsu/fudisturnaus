#!/usr/bin/env bash
set -e

yarn run lint
yarn run test
rspec spec
git push heroku master
heroku run rake db:migrate
