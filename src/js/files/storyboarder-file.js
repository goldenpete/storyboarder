const { writeFileAtomicSync } = require('./atomic-file-writer')

const serializeScene = sceneData =>
  JSON.stringify(sceneData, null, 2)

const writeSceneFile = (filePath, sceneData) =>
  writeFileAtomicSync(filePath, serializeScene(sceneData), { encoding: 'utf8' })

module.exports = {
  serializeScene,
  writeSceneFile
}
