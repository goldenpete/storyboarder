const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')

const {
  writeFileAtomicSync
} = require('../../src/js/files/atomic-file-writer')

describe('atomic-file-writer', () => {
  let temporaryDirectory

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboarder-atomic-writer-'))
  })

  afterEach(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  })

  it('writes a new file atomically', () => {
    const filePath = path.join(temporaryDirectory, 'scene.storyboarder')

    writeFileAtomicSync(filePath, 'first write', { encoding: 'utf8' })

    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'first write')
  })

  it('overwrites an existing file atomically', () => {
    const filePath = path.join(temporaryDirectory, 'scene.storyboarder')

    fs.writeFileSync(filePath, 'before', 'utf8')
    writeFileAtomicSync(filePath, 'after', { encoding: 'utf8' })

    assert.strictEqual(fs.readFileSync(filePath, 'utf8'), 'after')
  })

  it('cleans up temporary files after a rename failure', () => {
    const filePath = path.join(temporaryDirectory, 'scene.storyboarder')
    const originalRenameSync = fs.renameSync

    fs.renameSync = () => {
      throw new Error('rename failed')
    }

    try {
      assert.throws(
        () => writeFileAtomicSync(filePath, 'content', { encoding: 'utf8' }),
        /rename failed/
      )
    } finally {
      fs.renameSync = originalRenameSync
    }

    const leftovers = fs.readdirSync(temporaryDirectory)
      .filter(filename => filename.endsWith('.tmp'))

    assert.deepStrictEqual(leftovers, [])
    assert.strictEqual(fs.existsSync(filePath), false)
  })
})
