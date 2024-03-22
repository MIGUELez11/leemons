#!/bin/bash

declare -a processed_paths
declare -a modified_plugins

MODIFIED_PLUGINS="$1"

function get_package_name_and_version() {
  name=$(jq -r '.name' <package.json)
  version=$(jq -r '.version' <package.json)

  echo "$name|$version"
}

function get_depedencies_and_bump() {
  package_name=$1
  package_version=$2

  find . -name "package.json" -not -path "*/node_modules/*" -exec sh -c 'sed -i "" "s|\"$1\": \"[^\"]*\"|\"$1\": \"$2\"|g" "$0"' {} "$package_name" "$package_version" \;
}

function patch_package() {
  path=$1
  path_regex=" $1 "

  if [[ " ${processed_paths[*]} " =~ $path_regex ]]; then
    return
  fi

  processed_paths+=("$path")

  if [ -d "$path" ]; then
    cd "$path" || exit

    yarn version --patch --no-git-tag-version
    name_and_version=$(get_package_name_and_version)

    modified_plugins+=("$name_and_version")

    name=$(echo "$name_and_version" | cut -d'|' -f1)
    version=$(echo "$name_and_version" | cut -d'|' -f2)

    cd - || exit

    get_depedencies_and_bump "$name" "$version"
  else
    echo "plugin not found $path in $(pwd)" >&2
    exit 1
  fi
}

for plugin in $MODIFIED_PLUGINS; do
  patch_package "$plugin" >/dev/null
done

echo "${modified_plugins[@]}"
