const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');
const { authenticatedUser } = require('./general.js');
const regd_users = express.Router();

regd_users.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    if (!authenticatedUser(username, password)) return res.status(401).json({ message: 'Invalid login. Check username and password.' });
    const accessToken = jwt.sign({ username }, process.env.JWT_SECRET || 'access', { expiresIn: '1h' });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: 'User successfully logged in.', accessToken });
});

regd_users.put('/auth/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    const review = req.query.review || req.body.review;
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (!review) return res.status(400).json({ message: 'Review is required.' });
    const username = req.session.authorization.username;
    book.reviews[username] = review;
    return res.status(200).json({ message: 'Review successfully added or updated.', reviews: book.reviews });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    const username = req.session.authorization.username;
    if (!Object.prototype.hasOwnProperty.call(book.reviews, username)) return res.status(404).json({ message: 'No review by this user was found.' });
    delete book.reviews[username];
    return res.status(200).json({ message: 'Review successfully deleted.', reviews: book.reviews });
});

module.exports.authenticated = regd_users;