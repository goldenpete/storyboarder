const fs = require('fs')
const path = require('path')

let sequence = 0

const createTemporaryFilePath = filePath => {
  sequence += 1

  return path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.${sequence}.tmp`
  )
}

const cleanupTemporaryFile = temporaryFilePath => {
  try {
    if (fs.existsSync(temporaryFilePath)) {
      fs.unlinkSync(temporaryFilePath)
    }
  } catch (error) {
    // ignore cleanup failures and rethrow the original write error
  }
}

const writeFileAtomicSync = (filePath, data, options = {}) => {
  const temporaryFilePath = createTemporaryFilePath(filePath)
  let fileDescriptor

  try {
    fileDescriptor = fs.openSync(temporaryFilePath, 'w')
    fs.writeFileSync(fileDescriptor, data, options)
    fs.fsyncSync(fileDescriptor)
    fs.closeSync(fileDescriptor)
    fileDescriptor = null

    fs.renameSync(temporaryFilePath, filePath)
  } catch (error) {
    if (fileDescriptor != null) {
      try {
        fs.closeSync(fileDescriptor)
      } catch (closeError) {
        // ignore close failures while handling the original error
      }
    }

    cleanupTemporaryFile(temporaryFilePath)
    throw error
  }

  return filePath
}

module.exports = {
  createTemporaryFilePath,
  writeFileAtomicSync
}
