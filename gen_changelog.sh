# exit on error
set -e
PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
# --ignore-commits-without-issue
A=$(npx git-changelog-command-line --to-ref refs/heads/main \
--ignore-pattern "^\[maven-release-plugin\].*|^\[Gradle Release Plugin\].*|^Merge.*|^bump.*" \
--no-issue-name "" -std -tec "# Changelog

Changelog for {{ownerName}}{{repoName}}.

{{#tags}}
## {{name}} {{#issues}} {{#hasIssue}} {{#hasLink}}
### {{name}} [{{issue}}]({{link}}) {{title}} {{#hasIssueType}} *{{issueType}}* {{/hasIssueType}} {{#hasLabels}} {{#labels}} *{{.}}* {{/labels}} {{/hasLabels}} {{/hasLink}} {{^hasLink}}
### {{name}} {{issue}} {{title}} {{#hasIssueType}} *{{issueType}}* {{/hasIssueType}} {{#hasLabels}} {{#labels}} *{{.}}* {{/labels}} {{/hasLabels}} {{/hasLink}} {{/hasIssue}}
  {{#commits}}
**{{{messageTitle}}}**
* [{{hash}}](https://github.com/{{ownerName}}/{{repoName}}/commit/{{hash}}) *{{commitTime}}*
  {{/commits}}
 {{/issues}}
{{/tags}}
")

echo -e $A | awk '!NF {if (++n <= 2) print; next}; {n=0;print}' >CHANGELOG.md
