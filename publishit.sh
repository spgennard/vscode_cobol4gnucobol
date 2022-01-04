# exit on error
set -e
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

./gen_changelog.sh
git commit -m "Update CHANGELOG.md" CHANGELOG.md && true
git push
git tag -f $PACKAGE_VERSION
git push --tags --force
git clean -fdx
npm install
git push
vsce publish
rm -f *.vsix
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
