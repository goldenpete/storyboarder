const { createFilesystemSlug } = require('./filename-sanitizer')

const getSceneDirectorySuffix = (scene, fallbackSceneNumber) =>
  createFilesystemSlug(scene && scene.scene_id ? scene.scene_id : `G${fallbackSceneNumber}`, {
    fallback: `G${fallbackSceneNumber}`
  })

const getSceneDirectoryId = (scene, fallbackSceneNumber) => {
  const suffix = getSceneDirectorySuffix(scene, fallbackSceneNumber)
  const parts = suffix.split('-')

  return parts[parts.length - 1]
}

const getSceneDirectoryLabel = scene =>
  createFilesystemSlug(
    (scene && (scene.synopsis || scene.slugline)) || 'Scene',
    { fallback: 'Scene', maxLength: 50 }
  )

const createSceneDirectoryName = (scene, fallbackSceneNumber) => {
  const sceneNumber = (scene && scene.scene_number) || fallbackSceneNumber
  const label = getSceneDirectoryLabel(scene)
  const suffix = getSceneDirectorySuffix(scene, fallbackSceneNumber)

  return `Scene-${sceneNumber}-${label}-${suffix}`
}

const getSceneDirectoryIdFromName = directoryName => {
  const parts = String(directoryName || '').split('-')

  return parts.length ? parts[parts.length - 1] : ''
}

const findSceneDirectoryForScene = (scene, directoryNames = [], fallbackSceneNumber) => {
  const expectedDirectoryName = createSceneDirectoryName(scene, fallbackSceneNumber)
  const expectedDirectoryId = getSceneDirectoryId(scene, fallbackSceneNumber)

  return (
    directoryNames.find(directoryName => directoryName === expectedDirectoryName) ||
    directoryNames.find(
      directoryName => getSceneDirectoryIdFromName(directoryName) === expectedDirectoryId
    )
  )
}

module.exports = {
  createSceneDirectoryName,
  findSceneDirectoryForScene,
  getSceneDirectoryId,
  getSceneDirectoryIdFromName
}
