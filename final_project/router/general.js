const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const public_users = express.Router();
let users = [];

const isValid = username => users.some(user => user.username === username);
const authenticatedUser = (username, password) =>
    users.some(user => user.username === username && user.password === password);

public_users.get('/', (req, res) => res.status(200).json(books));

public_users.get('/isbn/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    return book ? res.status(200).json(book) : res.status(404).json({ message: 'Book not found.' });
});

public_users.get('/author/:author', (req, res) => {
    const author = decodeURIComponent(req.params.author).toLowerCase();
    const result = Object.fromEntries(Object.entries(books).filter(([, book]) => book.author.toLowerCase() === author));
    return Object.keys(result).length ? res.status(200).json(result) : res.status(404).json({ message: 'No books found for this author.' });
});

public_users.get('/title/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title).toLowerCase();
    const result = Object.fromEntries(Object.entries(books).filter(([, book]) => book.title.toLowerCase() === title));
    return Object.keys(result).length ? res.status(200).json(result) : res.status(404).json({ message: 'No books found with this title.' });
});

public_users.get('/review/:isbn', (req, res) => {
    const book = books[req.params.isbn];
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    return Object.keys(book.reviews).length ? res.status(200).json(book.reviews) : res.status(200).json({ message: 'No reviews found for this book.' });
});

public_users.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });
    if (isValid(username)) return res.status(409).json({ message: 'User already exists.' });
    users.push({ username, password });
    return res.status(201).json({ message: 'User successfully registered. Now you can login.' });
});

// Tareas 10-13: equivalentes asincronos con Axios.
const api = axios.create({ baseURL: process.env.API_URL || 'http://localhost:5000', timeout: 5000 });
public_users.get('/async/books', async (req, res) => {
    try { const response = await api.get('/'); return res.json(response.data); }
    catch (error) { return res.status(error.response?.status || 500).json({ message: error.message }); }
});
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try { const response = await api.get(`/isbn/${encodeURIComponent(req.params.isbn)}`); return res.json(response.data); }
    catch (error) { return res.status(error.response?.status || 500).json(error.response?.data || { message: error.message }); }
});
public_users.get('/async/author/:author', async (req, res) => {
    try { const response = await api.get(`/author/${encodeURIComponent(req.params.author)}`); return res.json(response.data); }
    catch (error) { return res.status(error.response?.status || 500).json(error.response?.data || { message: error.message }); }
});
public_users.get('/async/title/:title', async (req, res) => {
    try { const response = await api.get(`/title/${encodeURIComponent(req.params.title)}`); return res.json(response.data); }
    catch (error) { return res.status(error.response?.status || 500).json(error.response?.data || { message: error.message }); }
});

module.exports.general = public_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.authenticatedUser = authenticatedUser;
