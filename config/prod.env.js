const apiRoot   = (process.env.SDK_URL) ? "'" + process.env.SDK_URL + "'" : '"http://widget-composer-sdk.mybluemix.net/api"';
const thumbRoot = (process.env.THUMB_URL)? "'" + process.env.THUMB_URL + "'" : '"http://thumbnail-service.mybluemix.net"';
const container = (process.env.CONTAINER_QA)? "'" + process.env.CONTAINER_QA + "'" : '"test-project"';

module.exports = {
  NODE_ENV: '"production"',
  API_DATA_ROOT: apiRoot,
  THUMBNAIL_ROOT: thumbRoot,
  CONTAINER_QA: container,
}
