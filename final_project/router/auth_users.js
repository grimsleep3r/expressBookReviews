const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
}

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (isValid(username)) {
    return res.status(400).json({message: "Username is already taken"});
  }

  users.push({ username, password });

  return res.status(200).json({message: "Registered successfully"});
});

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!isValid(username) || !authenticatedUser(username, password)) {
    return res.status(401).json({message: "Invalid username or password"});
  }

  const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });

  return res.status(200).json({message: "Logged in successfully", token});
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const userExists = users.find(u => u.username === user.username);
    if (!userExists) {
      return res.status(404).json({message: "User not found"});
    }

    const book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }

    if (!book.reviews) {
      book.reviews = [];
    }

    // Check if the user has already reviewed the book
    const existingReview = book.reviews.find(r => r.username === user.username);
    if (existingReview) {
      // If the user has already reviewed the book, update the existing review
      existingReview.review = review;
    } else {
      // If the user hasn't reviewed the book yet, add a new review
      book.reviews.push({username: user.username, review});
    }

    return res.status(200).json({message: "Review added/updated successfully", book});
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    const userExists = users.find(u => u.username === user.username);
    if (!userExists) {
      return res.status(404).json({message: "User not found"});
    }

    const book = books[isbn];
    if (!book) {
      return res.status(404).json({message: "Book not found"});
    }

    const reviewIndex = book.reviews.findIndex(r => r.username === user.username);
    if (reviewIndex === -1) {
      return res.status(404).json({message: "Review not found"});
    }

    book.reviews.splice(reviewIndex, 1);

    return res.status(200).json({message: "Review deleted successfully", book});
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
