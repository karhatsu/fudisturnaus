#!/usr/bin/env bash
set -e

yarn run lint
rspec spec
git push heroku master
heroku run rake db:migrate
