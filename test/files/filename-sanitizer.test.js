const assert = require('assert')

const {
  ensureSafeFilename,
  createFilesystemSlug
} = require('../../src/js/files/filename-sanitizer')

describe('filename-sanitizer', () => {
  it('normalizes unsafe filenames and reserved Windows names', () => {
    assert.strictEqual(
      ensureSafeFilename('bad?.glb'),
      'bad.glb'
    )

    assert.strictEqual(
      ensureSafeFilename('aux.txt'),
      'aux-file.txt'
    )
  })

  it('creates stable slugs for scene labels and ids', () => {
    assert.strictEqual(
      createFilesystemSlug('EXT. A PLACE - DAY'),
      'EXT-A-PLACE-DAY'
    )

    assert.strictEqual(
      createFilesystemSlug('###', { fallback: 'Scene' }),
      'Scene'
    )
  })
})
