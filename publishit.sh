# exit on error
set -e

PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
git tag -f $PACKAGE_VERSION
git push --tags --force

./gen_changelog.sh
git commit -m "Update CHANGELOG.md" CHANGELOG.md && true
git push

git clean -fdx
npm install
git push
#npm run beforepublish
vsce publish
#npm run afterpublish
rm -f *.vsix

npm-check-updates

echo "use: ncu -u"
