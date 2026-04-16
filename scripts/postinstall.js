const { spawnSync } = require('child_process')

let electronBuilderCliPath

try {
  electronBuilderCliPath = require.resolve('electron-builder/cli.js')
} catch (error) {
  console.log('[postinstall] electron-builder is not installed; skipping install-app-deps')
  process.exit(0)
}

const result = spawnSync(process.execPath, [electronBuilderCliPath, 'install-app-deps'], {
  stdio: 'inherit'
})

if (result.error) {
  throw result.error
}

process.exit(result.status ?? 0)
