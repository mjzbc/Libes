const express = require('express');
const router = express.Router();
const Author = require('../models/author'); // import author schema
const Book = require('../models/book');

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

// New author
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author()});
});

// Create Author
router.post('/', async (req, res) => {
    
    // explicitly specify which fields to be updated on database
    // that is reason to abstract author into a var
    const author = new Author({
        name: req.body.name
    });

    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`);
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: "Error creating Author"
        })
    }
});

// Show author details page
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Book.find({ author: author.id}).limit(5).exec();
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        });
    } catch {
        res.redirect('/');
    }
});

// EDIT author page
router.get('/:id/edit', async(req, res) => {
    try {
        // get the author from mongoose library with ID
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author })

    } catch (e) {
        res.redirect('/authors')
    }
});

// UPDATE author on database
router.put('/:id', async (req, res) => {

    let author;

    try {
        author = await Author.findById(req.params.id);
        
        //update author parameters
        author.name = req.body.name;

        await author.save()
        res.redirect(`/authors/${author.id}`);
    } catch {
        //if author not found
        if( author == null ) {
            res.redirect('/');
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: "Error updating author"
            });
        }
    }
});

// delete author
router.delete('/:id', async (req, res) => {
    let author;

    try {
        author = await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors');
    } catch {
        //if author not found
        if( author == null ) {
            res.redirect('/');
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
});


module.exports = router;