#!/usr/bin/env bash
set -e

rm -f latest.dump
heroku pg:backups:download
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d fudisturnaus latest.dump
