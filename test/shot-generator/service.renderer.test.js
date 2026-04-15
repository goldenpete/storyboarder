const assert = require('assert')
const electron = require('electron')

const service = require('../../src/js/windows/shot-generator/service')

describe('shot-generator service', () => {
  let originalOnce
  let originalRemoveListener
  let originalSend

  beforeEach(() => {
    originalOnce = electron.ipcRenderer.once
    originalRemoveListener = electron.ipcRenderer.removeListener
    originalSend = electron.ipcRenderer.send
  })

  afterEach(() => {
    electron.ipcRenderer.once = originalOnce
    electron.ipcRenderer.removeListener = originalRemoveListener
    electron.ipcRenderer.send = originalSend
  })

  it('requests a save and resolves with the saved board', async () => {
    let listeners = {}
    let sent = []

    electron.ipcRenderer.once = (event, handler) => {
      listeners[event] = handler
    }
    electron.ipcRenderer.removeListener = (event, handler) => {
      if (listeners[event] === handler) {
        delete listeners[event]
      }
    }
    electron.ipcRenderer.send = channel => {
      sent.push(channel)
    }

    let request = service.saveShot()
    listeners.update(null, { board: { uid: 'board-1' } })

    assert.deepStrictEqual(sent, ['shot-generator:requestSaveShot'])
    assert.deepStrictEqual(await request, { uid: 'board-1' })
  })

  it('rejects when Storyboarder reports an error', async () => {
    let listeners = {}

    electron.ipcRenderer.once = (event, handler) => {
      listeners[event] = handler
    }
    electron.ipcRenderer.removeListener = (event, handler) => {
      if (listeners[event] === handler) {
        delete listeners[event]
      }
    }
    electron.ipcRenderer.send = () => {}

    let request = service.insertShot()
    listeners['shot-generator:error'](null, { message: 'Insert failed.' })

    await assert.rejects(request, /Insert failed\./)
  })
})
