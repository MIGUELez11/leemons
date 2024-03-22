#!/bin/bash

# Get commits
latest_commit=$(sh ./scripts/deployment/get_latest_pipeline_commit.sh)
latest_private_plugin_commit=$(sh ./scripts/deployment/get_latest_pipeline_commit.sh private-plugins)

# Bump packages
modified_packages=$(sh ./scripts/deployment/get_modified_packages.sh "$latest_commit")
# patched_packages=$(sh ./scripts/deployment/patch_and_publish_packages.sh "$modified_packages")

echo
echo "Patched packages:"

# for package in $patched_packages; do
#   echo "$package"
# done

echo "public-packages: $latest_commit"
echo "private-packages: $latest_private_plugin_commit"

# Bump public plugins
modified_plugins=$(sh ./scripts/deployment/get_modified_plugins.sh plugins "$latest_commit")
# patched_plugins=$(sh ./scripts/deployment/patch_and_build_plugins.sh "$modified_plugins")

# Bump private plugins
modified_private_plugins=$(sh ./scripts/deployment/get_modified_plugins.sh private-plugins "$latest_private_plugin_commit")
# patched_private_plugins=$(sh ./scripts/deployment/patch_and_build_plugins.sh "$modified_private_plugins")

# # Commit changes
# git -C private-plugins add -A
# git -C private-plugins commit -m "chore: bump plugins" -m "* Build plugins and push to ECR" -m "Workflow: deploy-saas"

# git add plugins private-plugins packages apps/dev/package.json
# git commit -m "chore: bump packages and plugins" -m "* Publish new versions of the packages and bump versions" -m "* Build plugins and push to ECR" -m "Workflow: deploy-saas"

# echo
# echo "Patched plugins:"

# # Build public plugins
# for plugin in $patched_plugins; do
#   plugin_name=$(echo "$plugin" | cut -d'|' -f1)
#   path="./plugins/$plugin_name"

#   echo "Building $path"
#   # sh ./scripts/deployment/build_dockers_by_uri.sh -d plugins "$path/backend"
# done

# # Build private plugins
# echo
# echo "Patched private plugins:"

# for plugin in $patched_private_plugins; do
#   plugin_name=$(echo "$plugin" | cut -d'|' -f1 | sed 's/-private$//')
#   path="./private-plugins/$plugin_name"

#   echo "Building $path"
#   # sh ./scripts/deployment/build_dockers_by_uri.sh -d private-plugins -p private "$path/backend"
# done

echo "packages"
echo
echo "$modified_packages"
echo
echo "plugins"
echo
echo "$modified_plugins"
echo
echo "private-plugins"
echo
echo "$modified_private_plugins"
