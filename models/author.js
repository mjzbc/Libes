const mongoose = require('mongoose');
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

// create a "pre" function that will check if 'remove' aka deleting
// an author has books before they're able to be deleted from DB
authorSchema.pre('remove', function(next) {
    //use normal function to get access to 'this' keyword
    Book.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err);
        } else if (books.length > 0) {
            next(new Error('This author still has books available'));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model('Author', authorSchema);