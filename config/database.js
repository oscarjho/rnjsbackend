if (process.env.NODE_ENV === 'production') {
  module.exports = require('./remotedatabase');
} else {
  module.exports = require('./localdatabase');
}
