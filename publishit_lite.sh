# exit on error
set -e
set -x
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

./gen_changelog.sh

rm -f *.vsix
vsce publish
vsce package
COMMIT_LOG=$(git log -1 --format='%ci %H %s')
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
github-release upload \
  --owner=spgennard \
  --commit main \
  --repo=vscode_cobol4gnucobol \
  --tag="$PACKAGE_VERSION" \
  --name=$PACKAGE_VERSION \
  --body="${COMMIT_LOG}" \
  gnucobol*.vsix
