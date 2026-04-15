const { ipcRenderer } = require('electron')

const service = {}
const REQUEST_TIMEOUT_MS = 30000

const requestBoardUpdate = channel =>
  new Promise((resolve, reject) => {
    let timeoutId

    const cleanup = () => {
      clearTimeout(timeoutId)
      ipcRenderer.removeListener('update', onUpdate)
      ipcRenderer.removeListener('shot-generator:error', onError)
    }

    const onUpdate = (event, { board }) => {
      cleanup()

      if (!board) {
        reject(new Error('Storyboarder did not return a board update.'))
        return
      }

      resolve(board)
    }

    const onError = (event, error = {}) => {
      cleanup()
      reject(new Error(error.message || 'Storyboarder failed to save the shot.'))
    }

    timeoutId = setTimeout(() => {
      cleanup()
      reject(new Error('Timed out waiting for Storyboarder to save the shot.'))
    }, REQUEST_TIMEOUT_MS)

    ipcRenderer.once('update', onUpdate)
    ipcRenderer.once('shot-generator:error', onError)
    ipcRenderer.send(channel)
  })

service.getStoryboarderFileData = () =>
  new Promise(resolve => {
    ipcRenderer.once('shot-generator:get-storyboarder-file-data', (event, data) => {
      resolve(data)
    })
    ipcRenderer.send('storyboarder:get-storyboarder-file-data')
  })

service.getStoryboarderState = () =>
  new Promise(resolve => {
    ipcRenderer.once('shot-generator:get-state', (event, data) => {
      resolve(data)
    })
    ipcRenderer.send('storyboarder:get-state')
  })

service.getBoards = () =>
  new Promise(resolve => {
    ipcRenderer.once('shot-generator:get-boards', (event, { boards }) => {
      resolve(boards)
    })
    ipcRenderer.send('storyboarder:get-boards')
  })

service.getBoard = uid =>
  new Promise(resolve => {
    ipcRenderer.once('shot-generator:get-board', (event, board) => {
      resolve(board)
    })
    ipcRenderer.send('storyboarder:get-board', uid)
  })

service.loadBoardByUid = async uid => {
  // ask main > Shot Generator > to call loadBoardByUid
  ipcRenderer.send('shot-generator:loadBoardByUid', uid)
}
service.saveShot = () =>
  requestBoardUpdate('shot-generator:requestSaveShot')
service.insertShot = () =>
  requestBoardUpdate('shot-generator:requestInsertShot')

module.exports = service
