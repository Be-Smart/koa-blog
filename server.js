const app = require('./index');

app.listen(process.env.PORT, () => {
  global.console.log(`App running on port ${process.env.PORT}`);
});
