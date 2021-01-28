var express = require('express')
var bodyParser = require('body-parser')
 
var app = express()
const port = 3000
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 

const errors = {
    NOT_FOUND: "NOT_FOUND",
    MISSING_FIELD_AUTHOR: "Field 'author' is required",
    MISSING_FIELD_TITLE: "Field 'title' is required",
    BOOK_ALREADY_EXISTS: "Book already exists.",
};
const books = {};

function getBook(id) {
    if(books[id]) {
        return books[id];
    }
    throw new Error(errors.NOT_FOUND);
}

function insertBook(newBook) {
    if(!newBook["author"]) {
        throw new Error(errors.MISSING_FIELD_AUTHOR);
    }
    if(!newBook["title"]) {
        throw new Error(errors.MISSING_FIELD_TITLE);
    }
    let hasSameBook = Object.values(books).filter(book => book.title == newBook.title && book.author == newBook.author);
    if(hasSameBook.length) {
        throw new Error(errors.BOOK_ALREADY_EXISTS);
    }
    let id = Object.keys(books).length;
    books[id] = {
        id: id,
        author: newBook.author,
        title: newBook.title
    };
    return books[id];
}

app.get('/api/books', (req, res) => {
    res.send(Object.values(books));
})

app.get('/api/books/:id', (req, res) => {
    try {
        res.send(getBook(req.params.id));
    } catch(err) {
        if(err.message = errors.NOT_FOUND) {
            res.status(404).send();
        } else {
            throw err;
        }
    }
})

app.put('/api/books', (req, res) => {
    res.send(insertBook(req.body));
})

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(400).send(
        {error: err.message}
    )
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})