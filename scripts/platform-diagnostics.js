const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const { resolveFfmpegPath } = require('../src/js/exporters/ffmpeg-path')
const { createPlatformDiagnosticsReport } = require('../src/js/platform/diagnostics')

const parseFfmpegVersion = output => {
  let match = output.match(/^ffmpeg version (\S+)/m)
  return match ? match[1] : null
}

const inspectFfmpeg = () => {
  let ffmpegPath = resolveFfmpegPath()
  let hasExplicitPath = path.isAbsolute(ffmpegPath) || ffmpegPath.includes(path.sep) || ffmpegPath.includes('/')
  let result = {
    path: ffmpegPath,
    exists: hasExplicitPath ? fs.existsSync(ffmpegPath) : null,
    version: null,
    error: null
  }

  try {
    let processResult = spawnSync(ffmpegPath, ['-version'], { encoding: 'utf8' })

    if (processResult.error) {
      result.error = processResult.error.message
      return result
    }

    result.version = parseFfmpegVersion(
      `${processResult.stdout || ''}\n${processResult.stderr || ''}`
    )

    if (processResult.status !== 0) {
      result.error = `ffmpeg exited with code ${processResult.status}`
    } else if (!result.version) {
      result.error = 'ffmpeg responded but no version string was found.'
    }
  } catch (error) {
    result.error = error.message
  }

  return result
}

let report = createPlatformDiagnosticsReport({
  ffmpeg: inspectFfmpeg()
})

process.stdout.write(JSON.stringify(report, null, 2) + '\n')
