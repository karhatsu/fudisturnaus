#!/usr/bin/env bash
set -e

npm run test
bundle exec rspec spec/models
bundle exec rspec spec/system
