const assert = require('assert')

window.TONE_SILENCE_VERSION_LOGGING = true
const exporterFfmpeg = require('../../src/js/exporters/ffmpeg')

describe('exporters/ffmpeg smoke', () => {
  it('can spawn ffmpeg and read a version string', async () => {
    let version = await exporterFfmpeg.checkVersion()

    assert.strictEqual(typeof version, 'string')
    assert(version.length > 0)
  }).timeout(15000)
})
