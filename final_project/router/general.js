const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the username is valid (not existing yet)
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const getAllBooks = () => new Promise((resolve, reject) => {
    resolve(books)
  })

  return getAllBooks().then(books => {
    res.send(JSON.stringify(books,null,4));
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const getBookByIsbn = () => new Promise((resolve, reject) => {
    resolve(books[isbn])
  })

  return getBookByIsbn().then(book => {
    res.send(book);
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const getBooksByAuthor = () => new Promise((resolve, reject) => {
    const author = req.params.author;
    const filteredBooks = {};
    Object.entries(books).forEach(([key, book]) => {
      if (author == book.author) {
        filteredBooks[key] = book;
      }
    });
    
    resolve(filteredBooks);
  })

  return getBooksByAuthor().then(filteredBooks => {
    res.send(filteredBooks);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const getBooksByTitle = () => new Promise((resolve, reject) => {
    const title = req.params.title;
    const filteredBooks = {};
    Object.entries(books).forEach(([key, book]) => {
      if (title == book.title) {
        filteredBooks[key] = book;
      }
    });
    
    resolve(filteredBooks);
  })

  return getBooksByTitle().then(filteredBooks => {
    res.send(filteredBooks);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
