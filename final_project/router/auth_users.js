const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{
    const user = users.find((user) => user.username === username && user.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ username }, 'secret-key', { expiresIn: '1h' });
        req.session.authorization = {
            accessToken,username
        }
        return res.status(200).json({ message: 'User successfully logged in', accessToken });
    } else {
        return res.status(401).json({ message: 'Invalid login credentials' });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const username = req.user.username;
    const isbn = req.params.isbn;
    const reviewText = req.body.review;

    books[isbn]["reviews"][username] = reviewText;

    return res.status(200).json({ message: 'Review added successfully' });

});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.user.username
    const isbn = req.params.isbn;

    delete books[isbn]["reviews"][username]

    return res.status(200).json({ message: 'Review Deleted successfully' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
