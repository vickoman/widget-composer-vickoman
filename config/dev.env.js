var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_DATA_ROOT: '"http://0.0.0.0:3000/api"',
  THUMBNAIL_ROOT: '"http://0.0.0.0:9000"',
})
