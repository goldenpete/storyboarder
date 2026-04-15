const assert = require('assert')
const fs = require('fs-extra')
const os = require('os')
const path = require('path')

describe('CopyFile', () => {
  let temporaryDirectory
  let CopyFile
  let copyFilePath
  let modelLoaderPath
  let logPath

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboarder-copy-file-'))
    copyFilePath = require.resolve('../../src/js/shot-generator/utils/CopyFile')
    modelLoaderPath = require.resolve('../../src/js/services/model-loader')
    logPath = require.resolve('../../src/js/shared/storyboarder-electron-log')

    delete require.cache[copyFilePath]
    delete require.cache[modelLoaderPath]
    delete require.cache[logPath]

    require.cache[modelLoaderPath] = {
      id: modelLoaderPath,
      filename: modelLoaderPath,
      loaded: true,
      exports: {
        needsCopy: ({ model }) => path.isAbsolute(model),
        projectFolder: type => ({
          character: path.join('models', 'characters')
        }[type])
      }
    }
    require.cache[logPath] = {
      id: logPath,
      filename: logPath,
      loaded: true,
      exports: {
        info: () => {}
      }
    }

    const moduleValue = require(copyFilePath)
    CopyFile = moduleValue.default || moduleValue
  })

  afterEach(() => {
    delete require.cache[copyFilePath]
    delete require.cache[modelLoaderPath]
    delete require.cache[logPath]
    fs.removeSync(temporaryDirectory)
  })

  it('copies custom models using a filesystem-safe filename', () => {
    let projectDirectory = path.join(temporaryDirectory, 'project')
    let sourceDirectory = path.join(temporaryDirectory, 'source')
    let storyboarderFilePath = path.join(projectDirectory, 'scene.storyboarder')
    let sourcePath = path.join(sourceDirectory, 'mañana.glb')

    fs.ensureDirSync(projectDirectory)
    fs.ensureDirSync(sourceDirectory)
    fs.writeFileSync(storyboarderFilePath, '{}')
    fs.writeFileSync(sourcePath, 'model-data')

    let relativePath = CopyFile(storyboarderFilePath, sourcePath, 'character')
    let copiedFilePath = path.join(projectDirectory, 'models', 'characters', 'manana.glb')

    assert.strictEqual(relativePath.replace(/\\/g, '/'), 'models/characters/manana.glb')
    assert.strictEqual(fs.readFileSync(copiedFilePath, 'utf8'), 'model-data')
  })
})
