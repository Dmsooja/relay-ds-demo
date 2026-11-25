const { getDefaultConfig } = require('expo/metro-config')
const { resolve } = require('node:path')

const config = getDefaultConfig(__dirname)
config.watchFolders = [resolve(__dirname, '../../shared')]
module.exports = config
