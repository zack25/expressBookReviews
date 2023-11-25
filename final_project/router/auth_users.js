const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js").books;
let findBooksByProp = require("./booksdb.js").findBooksByProp;
let getBookByISBN = require("./booksdb.js").getBookByISBN;
let deleteUserBookReview = require("./booksdb.js").deleteUserBookReview;
let setUserBookReview = require("./booksdb.js").setUserBookReview;
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean

  let fndUsers = users.filter((user) => user.username == username);
  return fndUsers.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean

  let fndUser = users.filter((user) => {
    return (user.username == username && user.password == password);
  });
  return fndUser.length > 0;

}

//only registered users can login
regd_users.post("/login", (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in - invalid parameters" });
  }
  if (authenticatedUser(username, password)) {
    //sign token
    let accessToken = jwt.sign({
      data: username
    }, "access", { expiresIn: 60 * 60 });
    req.session.authorization = {
      accessToken
    };
    return res.status(200).json({ message: "Successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }
 
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  
  let isbn = req.params.isbn;
  let username = req.body.username;
  let review = {content: req.query.review, date: new Date()};

  try {
    setUserBookReview(isbn, username, review);
    return res.status(200).json({ message: `Successfully saved review for isbn ${isbn}: ${review.content}` });
  } catch (error){

    return res.status(404).json({ message: error.message });

  }

});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  let isbn = req.params.isbn;
  let username = req.body.username;
  try {
    deleteUserBookReview(isbn, username);
    res.status(200).json({message: `Successfully deleted review for isbn ${isbn} written by user: ${username}`});
  } catch(error){
    return res.status(404).json({message: error.message});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
