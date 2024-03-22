#!/bin/bash

declare -a processed_paths
declare -a modified_packages

MODIFIED_PACKAGES="$1"

function get_package_name_and_version() {
  name=$(jq -r '.name' <package.json)
  version=$(jq -r '.version' <package.json)

  echo "$name|$version"
}

function get_depedencies_and_bump() {
  package_name=$1
  package_version=$2

  find . -name "package.json" -not -path "*/node_modules/*" -exec sh -c 'sed -i "" "s|\"$1\": \"[^\"]*\"|\"$1\": \"$2\"|g" "$0"' {} "$package_name" "$package_version" \;

  packages_to_update=$(find ./packages -name "package.json" -not -path node_modules -print0 | xargs -0 grep -l "$package_name" | xargs grep -L "\"name\": \"$package_name\"" | xargs -I {} echo {})

  for package in $packages_to_update; do
    patch_package "${package%package.json}"
  done
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

    modified_packages+=("$name_and_version")

    name=$(echo "$name_and_version" | cut -d'|' -f1)
    version=$(echo "$name_and_version" | cut -d'|' -f2)

    cd - || exit

    get_depedencies_and_bump "$name" "$version"
  else
    echo "plugin not found $path in $(pwd)" >&2
    exit 1
  fi
}

function publish_package() {
  path=$1

  cd "$path" || exit

  npm publish --access public

  cd - || exit
}

for package in $MODIFIED_PACKAGES; do
  patch_package "$package" >/dev/null
done

# for package in "${processed_paths[@]}"; do
#   publish_package "$package" >/dev/null
# done

echo "${modified_packages[@]}"
