#!/usr/bin/env bash
set -e

yarn run lint
yarn run test
bundle exec rspec spec/models
bundle exec rspec spec/system
git push heroku master
heroku run rake db:migrate
