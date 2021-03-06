/**
 * This file must be required at least ONCE.
 * After it's done, one can use require('mongoose')
 *
 * In web-app: ctx is done at init phase
 * In tests: in mocha.opts
 * In gulpfile: in beginning
 */

const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');

mongoose.Promise = Promise;
mongoose.plugin(beautifyUnique);

// if (process.env.MONGOOSE_DEBUG) {
// mongoose.set('debug', true);
// }

mongoose.connect(process.env.DB_URL, {
  useMongoClient: true,
});

module.exports = mongoose;
