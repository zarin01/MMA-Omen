const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CommentSchema = new Schema({
    body: String,
    username: String,
    userId: String,
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    createdAt: { type: Date, default: Date.now },
    upVote: Number,
    voters: [{ userId: String, vote: Number }],
    postId: String,
}, {
    timestamps: true,
});

const CommentModel = model('Comment', CommentSchema);

module.exports = CommentModel;
