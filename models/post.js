const mongoose = require('mongoose');

const { Schema } = mongoose;

const blogPostSchema = new Schema({
  title: {
    type: String,
    required: 'Title must be provided',
  },
  content: {
    type: String,
    required: 'Blog post must contain some content',
  },
  // author: {
  //   type: Schema.ObjectId,
  //   ref: 'user',
  //   required: true,
  // },
  tags: [{
    type: String,
    required: 'At least one tag must be provided',
  }],
}, {
  timestamps: true,
  toObject: {
    transform(doc, ret) {
      delete ret.__v;// eslint-disable-line
      return ret;
    },
  },
});

blogPostSchema.statics.getPostFields = ['title', 'content', 'tags'];

module.exports = mongoose.model('blogPost', blogPostSchema);
