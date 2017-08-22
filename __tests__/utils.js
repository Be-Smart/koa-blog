const mongoose = require('mongoose');

mongoose.Promise = Promise;

exports.initDb = () => {
  mongoose.connect(process.env.TEST_DB, {
    useMongoClient: true,
  });
};

exports.cleanDb = () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach((collection) => {
    if (collections[collection]) {
      collections[collection].remove();
    }
  });
};
