import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { ipcRenderer } from 'electron'

import { 
  getSerializedState,
  getWorld,

  selectObject,
  markSaved,
} from '../../shared/reducers/shot-generator'
import { ShadingType } from '../../vendor/shading-effects/ShadingType'

import { SHOT_LAYERS } from '../utils/ShotLayers'
import useShadingEffect from '../hooks/use-shading-effect'
const REQUEST_TIMEOUT_MS = 30000

const renderAll = (
  shotRenderer, cameraPlotRenderer,
  largeCanvasData, smallCanvasData,
  shotSize, cameraPlotSize,
  aspectRatio
) => {
  shotRenderer.current.setSize(shotSize.width, shotSize.height)
  renderShot(
    shotRenderer.current,
    largeCanvasData.current.scene,
    largeCanvasData.current.camera,
    { size: shotSize, aspectRatio }
  )
  let shotImageDataUrl = shotRenderer.current.domElement.toDataURL()

  cameraPlotRenderer.current.setSize(cameraPlotSize.width, cameraPlotSize.height)
  renderCameraPlot(
    cameraPlotRenderer.current,
    smallCanvasData.current.scene,
    smallCanvasData.current.camera,
    { size: cameraPlotSize }
  )
  let cameraPlotImageDataUrl = cameraPlotRenderer.current.domElement.toDataURL()

  return {
    shotImageDataUrl,
    cameraPlotImageDataUrl
  }
}

const setCameraAspectFromRendererSize = (renderer, camera) => {
  let size = renderer.getSize(new THREE.Vector2())
  camera.aspect = size.width / size.height
}

const renderShot = (renderer, scene, originalCamera) => {
  let camera = originalCamera.clone()

  camera.layers.set(SHOT_LAYERS)

  setCameraAspectFromRendererSize(renderer, camera)
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}

const renderCameraPlot = (renderer, scene, originalCamera) => {
  let camera = originalCamera.clone()

  camera.left = camera.bottom
  camera.right = camera.top

  setCameraAspectFromRendererSize(renderer, camera)
  camera.updateProjectionMatrix()

  renderer.render(scene, camera)
}

const waitForRender = () =>
  new Promise(resolve => setTimeout(resolve, 0))

const requestBoardUpdate = (channel, payload) =>
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
    ipcRenderer.send(channel, payload)
  })

const saveCurrentShot = (
  shotRenderer, cameraPlotRenderer,
  largeCanvasData, smallCanvasData,
  shotSize, cameraPlotSize,
  aspectRatio,
  enqueueStoryboarderRequest
) => (dispatch, getState) => {
  // de-select objects so they don't show in the saved image
  dispatch(selectObject(null))

  return enqueueStoryboarderRequest(async () => {
    await waitForRender()

    let state = getState()
    const { shotImageDataUrl, cameraPlotImageDataUrl } = renderAll(
      shotRenderer, cameraPlotRenderer,
      largeCanvasData, smallCanvasData,
      shotSize, cameraPlotSize,
      aspectRatio
    )

    let data = getSerializedState(state)
    let currentBoard = state.board
    let uid = currentBoard.uid

    let board = await requestBoardUpdate('saveShot', {
      uid,
      data,
      images: {
        camera: shotImageDataUrl,
        plot: cameraPlotImageDataUrl
      }
    })

    dispatch(markSaved())

    return board
  })
}

const insertNewShot = (
  shotRenderer, cameraPlotRenderer,
  largeCanvasData, smallCanvasData,
  shotSize, cameraPlotSize,
  aspectRatio,
  enqueueStoryboarderRequest
) => (dispatch, getState) => {
  // de-select objects so they don't show in the saved image
  dispatch(selectObject(null))

  return enqueueStoryboarderRequest(async () => {
    await waitForRender()

    let state = getState()

    const { shotImageDataUrl, cameraPlotImageDataUrl } = renderAll(
      shotRenderer, cameraPlotRenderer,
      largeCanvasData, smallCanvasData,
      shotSize, cameraPlotSize,
      aspectRatio
    )

    let data = getSerializedState(state)
    let currentBoard = state.board

    let board = await requestBoardUpdate('insertShot', {
      data,
      currentBoard,
      images: {
        camera: shotImageDataUrl,
        plot: cameraPlotImageDataUrl
      }
    })

    dispatch(markSaved())

    return board
  })
}

const useSaveToStoryboarder = (largeCanvasData, smallCanvasData, aspectRatio, shadingMode, backgroundColor) => {
  const dispatch = useDispatch()

  const imageRenderer = useRef()
  if (!imageRenderer.current) imageRenderer.current = new THREE.WebGLRenderer({ antialias: true })
  useEffect(() => {
    return () => {
      if (imageRenderer.current) imageRenderer.current = null
    }
  }, [])

  const shotSize = useMemo(() => new THREE.Vector2(Math.ceil(aspectRatio * 900), 900), [aspectRatio])
  const cameraPlotSize = useMemo(() => new THREE.Vector2(900, 900), [])

  const shotRenderer = useShadingEffect(imageRenderer.current, shadingMode, backgroundColor)
  const cameraPlotRenderer = useShadingEffect(imageRenderer.current, ShadingType.Outline, backgroundColor)
  const requestQueueRef = useRef(Promise.resolve())

  const enqueueStoryboarderRequest = useCallback(task => {
    const request = requestQueueRef.current.then(task)
    requestQueueRef.current = request.catch(() => undefined)
    return request
  }, [])

  const saveCurrentShotCb = useCallback(
    () => dispatch(
      saveCurrentShot(
        shotRenderer,
        cameraPlotRenderer,
        largeCanvasData,
        smallCanvasData,
        shotSize,
        cameraPlotSize,
        aspectRatio,
        enqueueStoryboarderRequest
      )
    ),
    [dispatch, shotRenderer, cameraPlotRenderer, largeCanvasData, smallCanvasData, shotSize, cameraPlotSize, aspectRatio, enqueueStoryboarderRequest]
  )

  const insertNewShotCb = useCallback(
    () => dispatch(
      insertNewShot(
        shotRenderer,
        cameraPlotRenderer,
        largeCanvasData,
        smallCanvasData,
        shotSize,
        cameraPlotSize,
        aspectRatio,
        enqueueStoryboarderRequest
      )
    ),
    [dispatch, shotRenderer, cameraPlotRenderer, largeCanvasData, smallCanvasData, shotSize, cameraPlotSize, aspectRatio, enqueueStoryboarderRequest]
  )

  return {
    saveCurrentShot: saveCurrentShotCb,
    insertNewShot: insertNewShotCb
  }
}

export default useSaveToStoryboarder
