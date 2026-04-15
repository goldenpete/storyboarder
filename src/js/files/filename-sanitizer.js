const path = require('path')

const INVALID_FILENAME_CHARACTERS = /[<>:"/\\|?*\u0000-\u001f]/g
const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i

const collapseReplacement = (value, replacement) => {
  const escapedReplacement = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  return value
    .replace(new RegExp(`${escapedReplacement}{2,}`, 'g'), replacement)
    .replace(new RegExp(`^${escapedReplacement}+|${escapedReplacement}+$`, 'g'), '')
}

const normalizeForFilesystem = value =>
  String(value == null ? '' : value)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')

const trimTrailingPeriodsAndSpaces = value =>
  value.replace(/[. ]+$/g, '')

const ensureSafeFilename = (value, options = {}) => {
  const {
    fallback = 'untitled',
    replacement = '-'
  } = options

  let filename = normalizeForFilesystem(value)
  let extension = path.extname(filename)
  let basename = extension
    ? filename.slice(0, -extension.length)
    : filename

  basename = trimTrailingPeriodsAndSpaces(
    basename
      .replace(INVALID_FILENAME_CHARACTERS, replacement)
      .replace(/\s+/g, ' ')
      .trim()
  )
  basename = collapseReplacement(basename, replacement)

  extension = trimTrailingPeriodsAndSpaces(
    extension.replace(INVALID_FILENAME_CHARACTERS, '')
  )

  if (!basename) {
    basename = fallback
  }

  if (WINDOWS_RESERVED_NAMES.test(basename)) {
    basename = `${basename}${replacement}file`
  }

  return `${basename}${extension}`
}

const createFilesystemSlug = (value, options = {}) => {
  const {
    fallback = 'untitled',
    maxLength = 50
  } = options

  let slug = normalizeForFilesystem(value)
    .replace(INVALID_FILENAME_CHARACTERS, ' ')
    .replace(/[']/g, '')
    .replace(/\./g, ' ')
    .replace(/\s*-\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  if (!slug) {
    slug = fallback
  }

  if (WINDOWS_RESERVED_NAMES.test(slug)) {
    slug = `${slug}-item`
  }

  if (slug.length > maxLength) {
    slug = slug.slice(0, maxLength).replace(/-+$/g, '')
  }

  return trimTrailingPeriodsAndSpaces(slug) || fallback
}

module.exports = {
  ensureSafeFilename,
  createFilesystemSlug
}
