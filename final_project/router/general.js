const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json({ books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const authorBooks = [];
  
    for (const isbn in books) {
      if (books[isbn]["author"] === author) {
        authorBooks.push(books[isbn]);
      }
    }
  
    if (authorBooks.length > 0) {
      return res.status(200).json({ books: authorBooks });
    } else {
      return res.status(404).json({ message: "Books by the author not found" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const titleBooks = [];
  
    for (const isbn in books) {
      if (books[isbn]["title"] === title) {
        titleBooks.push(books[isbn]);
      }
    }
  
    if (titleBooks.length > 0) {
      return res.status(200).json({ books: titleBooks });
    } else {
      return res.status(404).json({ message: "Books with the title not found" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book["reviews"]) {
      return res.status(200).json({ reviews: book["reviews"] });
    } else {
      return res.status(404).json({ message: "Reviews for the book not found" });
    }
});

module.exports.general = public_users;
