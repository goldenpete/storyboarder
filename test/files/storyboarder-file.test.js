const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')

const {
  serializeScene,
  writeSceneFile
} = require('../../src/js/files/storyboarder-file')

describe('storyboarder-file', () => {
  let temporaryDirectory

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboarder-scene-file-'))
  })

  afterEach(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true })
  })

  it('serializes scene data with stable indentation', () => {
    assert.strictEqual(
      serializeScene({ fps: 24 }),
      '{\n  "fps": 24\n}'
    )
  })

  it('writes and reloads a storyboarder scene file', () => {
    const filePath = path.join(temporaryDirectory, 'example.storyboarder')
    const sceneData = {
      version: '3.0.0',
      fps: 24,
      boards: [
        {
          uid: 'ABCDE',
          url: 'board-1-ABCDE.png'
        }
      ]
    }

    writeSceneFile(filePath, sceneData)

    assert.deepStrictEqual(
      JSON.parse(fs.readFileSync(filePath, 'utf8')),
      sceneData
    )
  })
})
