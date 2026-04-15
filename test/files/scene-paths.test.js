const assert = require('assert')

const {
  createSceneDirectoryName,
  findSceneDirectoryForScene,
  getSceneDirectoryId,
  getSceneDirectoryIdFromName
} = require('../../src/js/files/scene-paths')

describe('scene-paths', () => {
  const scene = {
    scene_number: '1',
    slugline: 'EXT. A PLACE - DAY',
    scene_id: '1-ZX3ZM'
  }

  it('creates directory names compatible with existing project fixtures', () => {
    assert.strictEqual(
      createSceneDirectoryName(scene, 1),
      'Scene-1-EXT-A-PLACE-DAY-1-ZX3ZM'
    )
  })

  it('finds directories by scene id when labels drift', () => {
    assert.strictEqual(
      findSceneDirectoryForScene(
        {
          ...scene,
          synopsis: 'Updated synopsis that changes the folder label'
        },
        [
          'Scene-1-EXT-A-PLACE-DAY-1-ZX3ZM',
          'Scene-2-INT-A-PLACE-DAY-2-FA5K7'
        ],
        1
      ),
      'Scene-1-EXT-A-PLACE-DAY-1-ZX3ZM'
    )
  })

  it('derives stable ids for explicit and generated scene ids', () => {
    assert.strictEqual(getSceneDirectoryId(scene, 1), 'ZX3ZM')
    assert.strictEqual(getSceneDirectoryIdFromName('Scene-4-INT-LAB-NIGHT-G4'), 'G4')
  })
})
