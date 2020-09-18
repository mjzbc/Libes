const express = require('express');
const router = express.Router();
const Author = require('../models/author'); // import author schema

// all authors
router.get('/', async (req, res) => {
    let searchOptions = {};

    // get requests pass in url params as query string (post sends in body)
    if (req.query.name !== null && req.query.name !== '') {
        // i is case insensitive
        searchOptions.name = new RegExp(req.query.name, 'i');
    }
    try {
        // pass searchOptions, not object, already object
        const authors = await Author.find(searchOptions);
        res.render('authors/index', { 
            authors: authors, 
            searchOptions: req.query
        })
    } catch {
        res.redirect('/');
    }
});

// new author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author()});
});

// Create Author Route
router.post('/', async (req, res) => {
    
    // explicitly specify which fields to be updated on database
    // that is reason to abstract author into a var
    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        //res.redirect(`authors/${newAuthor.id}`);
        res.redirect(`authors`);
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: "Error creating Author"
        })
    }

});

module.exports = router;