#!/usr/bin/env bash

get_package_name_and_version() {
  name=$(jq -r '.name' <package.json)
  version=$(jq -r '.version' <package.json)

  echo "$name|$version"
}

get_package_name_and_version
