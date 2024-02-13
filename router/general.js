const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



public_users.get("/allusers", (req, res) => {
  return res.status(200).json(users);
});

public_users.post("/register", (req, res) => {
  // Get the username and password from the request body
  const { username, password } = req.body;

  // Check if the username and password were provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({message: "Username already exists"});
  }

  // Register the new user
  users.push({ username, password });

  // Return a success message
  return res.status(200).json({message: "User registered successfully"});
});


public_users.get('/', function (req, res) {
  // Return the list of books
  return res.status(200).send(JSON.stringify(books, null, 2));
});

public_users.get('/books', async function (req, res) {
  try {
    // Simulate an asynchronous operation with a 2-second delay
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('Finished delay');
        resolve();
      }, 2000);
    });

    const response = await axios.get('http://localhost:5000/');
    console.log('Data fetched successfully');
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
});

public_users.get('/isbn/:isbn', function (req, res) {
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Get the book with the given ISBN
  const book = books[isbn];

  // If the book was not found, return a 404 Not Found status
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  // Return the book details
  return res.status(200).send(JSON.stringify(book, null, 2));
});
  
public_users.get('/isbn/axios/:isbn', async function (req, res) {
  try {
    // Get the ISBN from the request parameters
    const isbn = req.params.isbn;

    // Simulate an asynchronous operation with a 2-second delay
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('Finished delay');
        resolve();
      }, 2000);
    });

    // Make a GET request to your API endpoint with the ISBN
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

    // Send the response data
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
});

public_users.get('/author/:author', function (req, res) {
  // Get the author from the request parameters
  const author = req.params.author;

  // Get all the keys for the 'books' object
  const keys = Object.keys(books);

  // Initialize an array to hold the books by the given author
  const booksByAuthor = [];

  // Iterate through the 'books' array
  for (let i = 0; i < keys.length; i++) {
    // Check if the author matches the one provided in the request parameters
    if (books[keys[i]].author === author) {
      // If the author matches, add the book to the 'booksByAuthor' array
      booksByAuthor.push(books[keys[i]]);
    }
  }

  // If no books by the given author were found, return a 404 Not Found status
  if (booksByAuthor.length === 0) {
    return res.status(404).json({message: "No books found by this author"});
  }

  // Return the books by the given author
  return res.status(200).send(JSON.stringify(booksByAuthor, null, 2));
});

public_users.get('/author/axios/:author', async function (req, res) {
  try {
    // Get the author from the request parameters
    const author = req.params.author;

    // Simulate an asynchronous operation with a 2-second delay
    await new Promise(resolve => {
      setTimeout(() => {
        console.log('Finished delay');
        resolve();
      }, 2000);
    });

    // Make a GET request to your API endpoint with the author
    const response = await axios.get(`http://localhost:5000/author/${author}`);

    // Send the response data
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data');
  }
});

public_users.get('/title/:title', function (req, res) {
  // Get the title from the request parameters
  const title = req.params.title;

  // Get all the keys for the 'books' object
  const keys = Object.keys(books);

  // Initialize an array to hold the books with the given title
  const booksWithTitle = [];

  // Iterate through the 'books' array
  for (let i = 0; i < keys.length; i++) {
    // Check if the title matches the one provided in the request parameters
    if (books[keys[i]].title === title) {
      // If the title matches, add the book to the 'booksWithTitle' array
      booksWithTitle.push(books[keys[i]]);
    }
  }

  public_users.get('/title/axios/:title', async function (req, res) {
    try {
      // Get the title from the request parameters
      const title = req.params.title;
  
      // Simulate an asynchronous operation with a 2-second delay
      await new Promise(resolve => {
        setTimeout(() => {
          console.log('Finished delay');
          resolve();
        }, 2000);
      });
  
      // Make a GET request to your API endpoint with the title
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      // Send the response data
      res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred while fetching data');
    }
  });

  // If no books with the given title were found, return a 404 Not Found status
  if (booksWithTitle.length === 0) {
    return res.status(404).json({message: "No books found with this title"});
  }

  // Return the books with the given title
  return res.status(200).send(JSON.stringify(booksWithTitle, null, 2));
});

public_users.get('/review/:isbn', function (req, res) {
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Get the book with the given ISBN
  const book = books[isbn];

  // If the book was not found, return a 404 Not Found status
  if (!book) {
    return res.status(404).json({message: "Book not found"});
  }

  // Get the reviews of the book
  const reviews = book.reviews;

  // If the book has no reviews, return a message indicating this
  if (Object.keys(reviews).length === 0) {
    return res.status(200).json({message: "No reviews for this book"});
  }

  // Return the book reviews
  return res.status(200).send(JSON.stringify(reviews, null, 2));
});

module.exports.general = public_users;
