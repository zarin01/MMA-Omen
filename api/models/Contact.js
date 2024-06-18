const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ContactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    // Add any other fields you want to include in the contact form submission
}, {
    timestamps: true
});

const ContactModel = model('Contact', ContactSchema);

module.exports = ContactModel;
