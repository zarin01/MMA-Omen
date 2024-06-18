const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: String,
    summary: String,
    content: String,
    cover: String,
    alt: String,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    sports: String,
    organizations: String,
}, {
    timestamps: true,
});

const PostModel = model('Post', PostSchema);

module.exports = PostModel;