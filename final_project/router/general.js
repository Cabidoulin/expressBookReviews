const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        users.push({ "username": username, "password": password });
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
        return res.status(404).json({ message: "User already exists!" });
    }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn], null, 4));
    } else {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks[key] = books[key];
        }
    });

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for the given author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = {};

    Object.keys(books).forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks[key] = books[key];
        }
    });

    if (Object.keys(matchingBooks).length > 0) {
        return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
    } else {
        return res.status(404).json({ message: "No books found for the given title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found for the given ISBN" });
    }
});

module.exports.general = public_users;