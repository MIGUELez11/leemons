#!/usr/bin/env bash

function get_latest_pipeline_commit() {
  path="."
  if [ -d "$1" ]; then
    path="$1"
  fi

  git -C "$path" log --grep "Workflow: deploy-saas" --format="%H" -n 1
}

get_latest_pipeline_commit "$1"
