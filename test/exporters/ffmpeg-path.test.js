const assert = require('assert')
const path = require('path')

const {
  collectFfmpegCandidatePaths,
  resolveFfmpegPath
} = require('../../src/js/exporters/ffmpeg-path')

describe('exporters/ffmpeg-path', () => {
  it('prioritizes explicit environment overrides', () => {
    const resolvedPath = resolveFfmpegPath({
      env: {
        STORYBOARDER_FFMPEG_PATH: '/custom/ffmpeg'
      },
      reportedPath: '/reported/ffmpeg',
      existsSync: candidate => candidate === path.normalize('/custom/ffmpeg')
    })

    assert.strictEqual(resolvedPath, path.normalize('/custom/ffmpeg'))
  })

  it('adds unpacked asar candidates for packaged builds', () => {
    const candidates = collectFfmpegCandidatePaths({
      env: {},
      reportedPath: '/app/resources/app.asar/node_modules/ffmpeg-static/ffmpeg',
      mainModuleFilename: '/app/resources/app.asar/dist/main.js',
      resourcesPath: '/app/resources',
      platform: 'linux'
    })

    assert(candidates.includes(path.normalize('/app/resources/app.asar.unpacked/node_modules/ffmpeg-static/ffmpeg')))
  })

  it('falls back to the first existing unpacked candidate', () => {
    const resolvedPath = resolveFfmpegPath({
      env: {},
      reportedPath: '/app/resources/app.asar/node_modules/ffmpeg-static/ffmpeg',
      mainModuleFilename: '/app/resources/app.asar/dist/main.js',
      resourcesPath: '/app/resources',
      platform: 'linux',
      existsSync: candidate =>
        candidate === path.normalize('/app/resources/app.asar.unpacked/node_modules/ffmpeg-static/ffmpeg')
    })

    assert.strictEqual(
      resolvedPath,
      path.normalize('/app/resources/app.asar.unpacked/node_modules/ffmpeg-static/ffmpeg')
    )
  })

  it('returns the reported path when no candidates exist', () => {
    const resolvedPath = resolveFfmpegPath({
      env: {},
      reportedPath: '/reported/ffmpeg.exe',
      platform: 'win32',
      existsSync: () => false
    })

    assert.strictEqual(resolvedPath, path.normalize('/reported/ffmpeg.exe'))
  })
})
