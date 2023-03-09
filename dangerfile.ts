import {danger, markdown, warn} from 'danger'

const github = danger.github
const pr = github.pr
const modified = danger.git.modified_files

let errorCount = 0
const bigPRThreshold = 400

const modifiedAppFiles = modified.filter((filePath) => filePath.includes('src/'))

const modifiedTestFiles = modified.filter(function (filePath) {
  return filePath.match(/test.ts$/gi)
})

if (pr.additions + pr.deletions > bigPRThreshold) {
  warn(`:exclamation: Big PR (${++errorCount})`)
  markdown(
    `> (${errorCount}) : Pull Request size seems relatively large. If Pull Request contains multiple changes, split each into separate PR will helps faster, easier review.`,
  )
}

const packageChanged = modified.includes('package.json')
const lockfileChanged = modified.includes('yarn.lock')
if (packageChanged && !lockfileChanged) {
  warn(`:exclamation: yarn.lock not updated (${++errorCount})`)
  const message = 'Changes were made to package.json, but not to yarn.lock'
  const idea = 'Perhaps you need to run `yarn install`?'
  warn(`${message} - <i>${idea}</i>`)
  markdown(`> (${errorCount}) : ${message} - <i>${idea}</i>`)
}

const hasAppChanges = modifiedAppFiles.length > 0
const hasTestChanges = modifiedTestFiles.length > 0
if (hasAppChanges && !hasTestChanges) {
  warn(`:exclamation: Missing Tests (${++errorCount})`)
  markdown(
    `> (${errorCount}) : there are app changes, but not tests. That's OK as long as you're refactoring existing code`,
  )
}
