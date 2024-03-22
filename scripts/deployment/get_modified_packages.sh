#!/bin/bash

function get_all_files() {
  find packages -mindepth 1 -maxdepth 1 -type d -exec echo {} +
}

function get_diff_files() {
  git diff --name-only "$1" | grep '^packages/' | cut -d'/' -f1-2 | uniq
}

if [ -z "$1" ]; then
  get_all_files
else
  get_diff_files "$1"
fi
