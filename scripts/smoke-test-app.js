const fs = require('fs')
const os = require('os')
const path = require('path')
const { spawnSync } = require('child_process')
const fse = require('fs-extra')
const electronBinary = require('electron')

const projectRoot = path.join(__dirname, '..')
const fixtureDirectory = path.join(projectRoot, 'test', 'fixtures', 'projects', 'multi-scene')
const artifactsDirectory = path.join(projectRoot, 'artifacts', 'smoke-test-app')

const writeArtifact = (name, payload) => {
  fse.ensureDirSync(artifactsDirectory)
  fs.writeFileSync(
    path.join(artifactsDirectory, name),
    JSON.stringify(payload, null, 2),
    'utf8'
  )
}

const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboarder-smoke-app-'))
const workingFixtureDirectory = path.join(temporaryDirectory, 'multi-scene')

try {
  fse.copySync(fixtureDirectory, workingFixtureDirectory)

  const projectPath = path.join(workingFixtureDirectory, 'multi-scene.fountain')
  const electronArgs = [
    '.',
    ...(process.argv.includes('--no-sandbox') ? ['--no-sandbox'] : [])
  ]
  const result = spawnSync(
    electronBinary,
    electronArgs,
    {
      cwd: projectRoot,
      encoding: 'utf8',
      timeout: 180000,
      env: {
        ...process.env,
        NODE_ENV: 'development',
        STORYBOARDER_SMOKE_TEST: '1',
        STORYBOARDER_SMOKE_PROJECT: projectPath
      }
    }
  )

  const artifact = {
    projectPath,
    status: result.status,
    signal: result.signal,
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error ? result.error.message : null
  }

  writeArtifact(`result-${process.platform}.json`, artifact)

  if (result.stdout) {
    process.stdout.write(result.stdout)
  }
  if (result.stderr) {
    process.stderr.write(result.stderr)
  }

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(`App smoke test failed with exit code ${result.status}`)
  }
} finally {
  fse.removeSync(temporaryDirectory)
}
