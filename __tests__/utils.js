const mongoose = require('mongoose');

mongoose.Promise = Promise;

exports.initDb = () => {
  mongoose.connect(process.env.TEST_DB, {
    useMongoClient: true,
  });
};

exports.cleanDb = () => {
  Object.keys(mongoose.connection.collections).forEach((collection) => {
    if (mongoose.connection.collections[collection]) {
      mongoose.connection.collections[collection].remove();
    }
  });
};
