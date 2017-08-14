module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    const preferredType = ctx.accepts('html', 'json');

    if (e.status) {
      // could use template methods to render error page
      ctx.body = e.message;
      ctx.status = e.status;
    } else if (e.name === 'ValidationError') {
      ctx.status = 400;

      const errors = {};

      Object.keys(e.errors).forEach((field) => {
        errors[field] = e.errors[field];
      });

      ctx.body = preferredType === 'json' ? { errors } : `Error: ${errors.title.message}`;
    } else {
      ctx.body = 'Error 500';
      ctx.status = 500;
      global.console.error(e.message, e.stack);
    }
  }
};
