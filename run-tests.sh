#!/usr/bin/env bash
set -e

yarn run test
bundle exec rspec spec/models
bundle exec rspec spec/system
