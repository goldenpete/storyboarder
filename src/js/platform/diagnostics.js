const os = require('os')

const isTruthyEnv = value =>
  value === '1' || value === 'true' || value === 'TRUE'

const getSupportTier = ({ platform = process.platform } = {}) =>
  ['win32', 'darwin', 'linux'].includes(platform)
    ? 'supported'
    : 'best-effort'

const createEnvSnapshot = (env = process.env) => ({
  ci: isTruthyEnv(env.CI),
  appImage: env.APPIMAGE || null,
  appDir: env.APPDIR || null,
  xdgSessionType: env.XDG_SESSION_TYPE || null,
  waylandDisplay: env.WAYLAND_DISPLAY || null,
  display: env.DISPLAY || null
})

const getCompatibilityNotes = ({
  platform = process.platform,
  arch = process.arch,
  env = process.env
} = {}) => {
  let notes = []

  switch (platform) {
    case 'darwin':
      if (arch === 'arm64') {
        notes.push('Apple Silicon should use native arm64 dependencies where possible. Reinstall dependencies from a clean checkout if the architecture changes.')
        notes.push('Verify FFmpeg resolves and reports a version before cutting a macOS release.')
      } else {
        notes.push('macOS Intel remains in scope. Validate launch, save/reload, and export before cutting a release.')
      }
      break
    case 'linux':
      notes.push('Linux support is best-effort across desktop environments. Capture the display server and compositor when triaging launch issues.')

      if (env.APPIMAGE) {
        notes.push('AppImage runtime detected. Attach terminal logs and the AppImage path when reporting launch failures.')
      }

      if ((env.XDG_SESSION_TYPE || '').toLowerCase() === 'wayland' || env.WAYLAND_DISPLAY) {
        notes.push('Wayland session detected. Confirm whether the same issue reproduces under an X11 session when possible.')
      }
      break
    case 'win32':
      notes.push('Validate mouse, pen, and touch flows against docs/WINDOWS_INPUT_VALIDATION.md before marking Windows fixes complete.')
      break
    default:
      notes.push('This platform is outside the current support baseline.')
      break
  }

  return notes
}

const createPlatformDiagnosticsReport = ({
  generatedAt = new Date().toISOString(),
  platform = process.platform,
  arch = process.arch,
  release = os.release(),
  env = process.env,
  versions = process.versions,
  ffmpeg = {}
} = {}) => ({
  generatedAt,
  runtime: {
    platform,
    arch,
    release,
    node: versions.node || null,
    electron: versions.electron || null,
    chrome: versions.chrome || null
  },
  support: {
    tier: getSupportTier({ platform }),
    notes: getCompatibilityNotes({ platform, arch, env })
  },
  env: createEnvSnapshot(env),
  ffmpeg: {
    path: ffmpeg.path || null,
    exists: Object.prototype.hasOwnProperty.call(ffmpeg, 'exists') ? ffmpeg.exists : null,
    version: ffmpeg.version || null,
    error: ffmpeg.error || null
  },
  docs: [
    'docs/PLATFORM_COMPATIBILITY.md',
    ...(platform === 'linux' ? ['docs/LINUX_APPIMAGE_DIAGNOSTICS.md'] : []),
    ...(platform === 'win32' ? ['docs/WINDOWS_INPUT_VALIDATION.md'] : [])
  ]
})

module.exports = {
  createEnvSnapshot,
  createPlatformDiagnosticsReport,
  getCompatibilityNotes,
  getSupportTier
}
