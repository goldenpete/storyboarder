const assert = require('assert')

const {
  createPlatformDiagnosticsReport,
  getCompatibilityNotes,
  getSupportTier
} = require('../../src/js/platform/diagnostics')

describe('platform diagnostics', () => {
  it('marks the core desktop platforms as supported', () => {
    assert.strictEqual(getSupportTier({ platform: 'win32' }), 'supported')
    assert.strictEqual(getSupportTier({ platform: 'darwin' }), 'supported')
    assert.strictEqual(getSupportTier({ platform: 'linux' }), 'supported')
    assert.strictEqual(getSupportTier({ platform: 'freebsd' }), 'best-effort')
  })

  it('adds Apple Silicon guidance for darwin arm64', () => {
    let notes = getCompatibilityNotes({
      platform: 'darwin',
      arch: 'arm64',
      env: {}
    })

    assert(notes.some(note => note.includes('Apple Silicon')))
    assert(notes.some(note => note.includes('FFmpeg')))
  })

  it('adds AppImage and Wayland guidance for Linux', () => {
    let report = createPlatformDiagnosticsReport({
      platform: 'linux',
      arch: 'x64',
      env: {
        APPIMAGE: '/tmp/Storyboarder.AppImage',
        XDG_SESSION_TYPE: 'wayland',
        WAYLAND_DISPLAY: 'wayland-0'
      },
      ffmpeg: {
        path: '/usr/bin/ffmpeg',
        exists: true,
        version: '6.1'
      }
    })

    assert(report.support.notes.some(note => note.includes('AppImage runtime detected')))
    assert(report.support.notes.some(note => note.includes('Wayland session detected')))
    assert(report.docs.includes('docs/LINUX_APPIMAGE_DIAGNOSTICS.md'))
  })

  it('adds Windows input validation guidance', () => {
    let report = createPlatformDiagnosticsReport({
      platform: 'win32',
      arch: 'x64',
      env: {}
    })

    assert(report.support.notes.some(note => note.includes('docs/WINDOWS_INPUT_VALIDATION.md')))
    assert(report.docs.includes('docs/WINDOWS_INPUT_VALIDATION.md'))
  })
})
