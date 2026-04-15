const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

const projectRoot = path.join(__dirname, '..')
const testRoot = path.join(projectRoot, 'test')

const smokeTestFiles = [
  'test/exporters/common.renderer.test.js',
  'test/exporters/ffmpeg-path.test.js',
  'test/exporters/ffmpeg-version.renderer.test.js',
  'test/exporters/pdf/format-msecs.main.test.js',
  'test/files/atomic-file-writer.test.js',
  'test/files/filename-sanitizer.test.js',
  'test/files/scene-paths.test.js',
  'test/files/storyboarder-file.test.js',
  'test/models/board.main.test.js',
  'test/platform/diagnostics.test.js',
  'test/prefs.main.test.js',
  'test/shot-generator/CopyFile.renderer.test.js',
  'test/shot-generator/service.renderer.test.js',
  'test/shot-generator/services/filepaths.renderer.test.js'
]

const rendererOverrideTests = new Set([
  'test/exporters/archive.test.js',
  'test/exporters/cleanup.test.js',
  'test/exporters/copy-project.test.js'
])

const stableMochaTests = new Set([
  'test/exporters/ffmpeg-path.test.js',
  'test/files/atomic-file-writer.test.js',
  'test/files/filename-sanitizer.test.js',
  'test/files/scene-paths.test.js',
  'test/files/storyboarder-file.test.js',
  'test/importers/fountain-scene-id-util.test.js',
  'test/models/shot-list.test.js',
  'test/platform/diagnostics.test.js',
  'test/util/util.test.js'
])

const relative = filePath => path.relative(projectRoot, filePath).replace(/\\/g, '/')

const listFiles = directoryPath => {
  let files = []

  for (let entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name)

    if (entry.isDirectory()) {
      files = files.concat(listFiles(entryPath))
    } else if (entry.isFile() && entryPath.endsWith('.js')) {
      files.push(entryPath)
    }
  }

  return files
}

const isRendererTest = filePath =>
  rendererOverrideTests.has(filePath) ||
  /\.renderer\.test\.js$/.test(filePath) ||
  /\.test\.renderer\.js$/.test(filePath)

const isMainTest = filePath =>
  /\.main\.test\.js$/.test(filePath) || /\.test\.main\.js$/.test(filePath)

const isMochaTest = filePath =>
  /\.test\.js$/.test(filePath) && !isRendererTest(filePath) && !isMainTest(filePath)

const allTestFiles = listFiles(testRoot).map(relative)
const mochaTests = allTestFiles.filter(filePath =>
  isMochaTest(filePath) && stableMochaTests.has(filePath)
)
const rendererTests = allTestFiles.filter(isRendererTest)
const mainTests = allTestFiles.filter(isMainTest)

const dependencyPath = (...parts) =>
  path.join(projectRoot, 'node_modules', ...parts)

const runProcess = (label, command, args) => {
  console.log(`\n[tests] ${label}`)
  console.log(`[tests] ${[command, ...args].join(' ')}`)

  const result = spawnSync(command, args, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false
  })

  if (result.error) {
    console.error(result.error)
  }

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

const runElectronMocha = (label, args) => {
  const electronMochaArgs = [
    dependencyPath('electron-mocha', 'bin', 'electron-mocha'),
    '-r',
    '@babel/register',
    ...args
  ]

  if (process.platform === 'linux' && process.env.CI && fs.existsSync('/usr/bin/xvfb-run')) {
    runProcess(label, 'xvfb-run', ['-a', process.execPath, ...electronMochaArgs])
  } else {
    runProcess(label, process.execPath, electronMochaArgs)
  }
}

const runAppSmokeTest = () => {
  const args = [path.join(projectRoot, 'scripts', 'smoke-test-app.js')]

  if (process.platform === 'linux' && process.env.CI && fs.existsSync('/usr/bin/xvfb-run')) {
    runProcess('app smoke', 'xvfb-run', ['-a', process.execPath, ...args])
  } else {
    runProcess('app smoke', process.execPath, args)
  }
}

const runSuite = (suiteName, files) => {
  if (!files.length) return

  switch (suiteName) {
    case 'mocha':
      runProcess('mocha', process.execPath, [
        dependencyPath('mocha', 'bin', 'mocha'),
        '-r',
        '@babel/register',
        ...files
      ])
      break
    case 'renderer':
      runElectronMocha('electron-mocha (renderer)', ['--renderer', ...files])
      break
    case 'main':
      runElectronMocha('electron-mocha (main)', files)
      break
  }
}

const smokeMochaTests = smokeTestFiles.filter(isMochaTest)
const smokeRendererTests = smokeTestFiles.filter(isRendererTest)
const smokeMainTests = smokeTestFiles.filter(isMainTest)

const mode = process.argv[2] || 'all'

switch (mode) {
  case 'mocha':
    runSuite('mocha', mochaTests)
    break
  case 'renderer':
    runSuite('renderer', rendererTests)
    break
  case 'main':
    runSuite('main', mainTests)
    break
  case 'smoke':
    runSuite('mocha', smokeMochaTests)
    runSuite('renderer', smokeRendererTests)
    runSuite('main', smokeMainTests)
    runAppSmokeTest()
    break
  case 'all':
    runSuite('mocha', mochaTests)
    runSuite('renderer', rendererTests)
    runSuite('main', mainTests)
    break
  default:
    console.error(`Unknown test mode: ${mode}`)
    process.exit(1)
}
