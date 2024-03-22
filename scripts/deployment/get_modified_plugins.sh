#!/bin/bash

function get_all_files() {
  find "$1" -mindepth 2 -maxdepth 2 -name backend -type d -exec echo {} +
}

function get_diff_files() {
  path=$1
  commit=$2

  if [ "$path" = "plugins" ]; then
    git diff --name-only "$commit" | grep "^$path/.*/backend" | cut -d'/' -f1-3 | uniq
  else
    git -C "$path" diff --name-only "$commit" | grep "^.*/backend" | sed "s|^|$path/|" | cut -d'/' -f1-3 | uniq
  fi
}

if [ -z "$2" ]; then
  get_all_files "$1"
else
  get_diff_files "$1" "$2"
fi
