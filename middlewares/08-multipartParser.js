// recieve multipart/form
// without files

// for routes which require custom file handling
// can introduce config to ignore them here

const busboy = require('co-busboy');
const convert = require('koa-convert');


module.exports = convert(function* (next) {//eslint-disable-line
  // the body isn't multipart, so busboy can't parse it
  if (!this.request.is('multipart/*')) {
    return yield* next;
  }

  const parser = busboy(this, {
    autoFields: true,
  });

  let fileStream;//eslint-disable-line

  while (fileStream = yield parser) {//eslint-disable-line
    // filesStream - stream with file
    // autoFields => part is a file
    // specific handlers know how to handle the file, not us
    // alt: can auto-save to disk
    this.throw(400, 'Files are not allowed here');
  }

  // copy normal fields from parser to ctx.request.body
  const body = this.request.body;

  for (let [name, val, fieldnameTruncated, valTruncated] of parser.fields) {//eslint-disable-line
    if (body[name]) { // same value already exists
      if (!Array.isArray(body[name])) { //  convert to array
        body[name] = [body[name]];
      }
      body[name].push(val);
    } else {
      body[name] = val;
    }
  }

  yield* next;
});
