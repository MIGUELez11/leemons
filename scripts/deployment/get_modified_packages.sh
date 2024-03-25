#!/bin/bash

function get_all_files() {
  find packages -mindepth 1 -maxdepth 1 -type d -exec echo {} +
}

function get_diff_files() {
  git diff --name-only "$1" | grep '^packages/' | cut -d'/' -f1-2 | uniq
}

function omit_packages() {
  local packages_to_omit="packages/leemons-testing packages/leemons-react"
  for package in $1; do
    if [[ ! $packages_to_omit =~ $package ]]; then
      echo "$package"
    fi
  done
}

if [ -z "$1" ]; then
  result=$(get_all_files)
else
  result=$(get_diff_files "$1")
fi

omit_packages "$result"
