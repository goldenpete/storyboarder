const fs = require('fs')
const path = require('path')

const reportedFfmpegPath = require('ffmpeg-static')

const getDefaultBinaryName = platform =>
  platform === 'win32' ? 'ffmpeg.exe' : 'ffmpeg'

const getMainModuleFilename = () => {
  if (!('electron' in process.versions)) return null

  try {
    if (process.type === 'renderer') {
      return require('@electron/remote').process.mainModule.filename
    }

    return require.main && require.main.filename
  } catch (error) {
    return null
  }
}

const dedupePaths = (paths, platform) => {
  const seen = new Set()
  const result = []

  for (let candidatePath of paths) {
    if (!candidatePath) continue

    const normalizedPath = path.normalize(candidatePath)
    const key = platform === 'win32'
      ? normalizedPath.toLowerCase()
      : normalizedPath

    if (seen.has(key)) continue
    seen.add(key)
    result.push(normalizedPath)
  }

  return result
}

const collectFfmpegCandidatePaths = ({
  env = process.env,
  platform = process.platform,
  reportedPath = reportedFfmpegPath,
  mainModuleFilename = getMainModuleFilename(),
  resourcesPath = process.resourcesPath
} = {}) => {
  const binaryName = reportedPath
    ? path.basename(reportedPath)
    : getDefaultBinaryName(platform)

  const candidates = [
    env.STORYBOARDER_FFMPEG_PATH,
    env.FFMPEG_PATH
  ]

  if (reportedPath && reportedPath.includes('app.asar')) {
    candidates.push(reportedPath.replace('app.asar', 'app.asar.unpacked'))
  }

  candidates.push(reportedPath)

  if (mainModuleFilename && mainModuleFilename.includes('app.asar')) {
    const asarIndex = mainModuleFilename.indexOf('app.asar')
    const appRoot = mainModuleFilename.slice(0, asarIndex + 'app.asar'.length)
    const unpackedRoot = appRoot.replace('app.asar', 'app.asar.unpacked')
    candidates.push(path.join(unpackedRoot, 'node_modules', 'ffmpeg-static', binaryName))
  }

  if (resourcesPath) {
    candidates.push(path.join(resourcesPath, 'app.asar.unpacked', 'node_modules', 'ffmpeg-static', binaryName))
    candidates.push(path.join(resourcesPath, 'node_modules', 'ffmpeg-static', binaryName))
    candidates.push(path.join(resourcesPath, binaryName))
  }

  return dedupePaths(candidates, platform)
}

const resolveFfmpegPath = ({
  existsSync = fs.existsSync,
  ...options
} = {}) => {
  const candidates = collectFfmpegCandidatePaths(options)
  const resolvedPath = candidates.find(candidate => {
    try {
      return existsSync(candidate)
    } catch (error) {
      return false
    }
  })

  return resolvedPath || candidates[0] || getDefaultBinaryName(options.platform || process.platform)
}

module.exports = {
  collectFfmpegCandidatePaths,
  resolveFfmpegPath
}
