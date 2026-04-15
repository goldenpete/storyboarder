const path = require('path')
const { spawnSync } = require('child_process')

const projectRoot = path.join(__dirname, '..')
const webpackCliPath = path.join(projectRoot, 'node_modules', 'webpack', 'bin', 'webpack.js')
const nodeMajorVersion = Number(process.versions.node.split('.')[0])

const nodeArgs = []

if (nodeMajorVersion >= 17) {
  nodeArgs.push('--openssl-legacy-provider')
}

nodeArgs.push(webpackCliPath, ...process.argv.slice(2))

const result = spawnSync(process.execPath, nodeArgs, {
  cwd: process.cwd(),
  stdio: 'inherit'
})

if (result.error) {
  console.error(result.error)
}

process.exit(result.status || 0)
