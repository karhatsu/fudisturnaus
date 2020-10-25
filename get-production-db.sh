#!/usr/bin/env bash
set -e

rm latest.dump
heroku pg:backups:download
pg_restore --verbose --clean --no-acl --no-owner -h localhost -d fudisturnaus latest.dump
