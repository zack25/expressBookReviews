const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
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
    return res.status(404).json({ message: "Error logging in" });
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
    return res.status(208).json({ message: "Invalid login. Check username and password" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  //Write your code here
  let book = books[req.body.isbn];
  let username = req.body.username;
  // let username = req.session.authorization.username;
  if (book) {

    //  if(!book.reviews.hasOwnProperty(username)) {
    book.reviews[username] = { content: req.body.review, date: new Date() };
    return res.status(200).json({ message: `Successfully set review for isbn ${req.body.isbn}: ${req.body.review}` });

    // }
  } else {
    return res.status(404).json({ message: JSON.stringify("Provided ISBN does not exist", null, 4) });
  }
  // return res.status(204)
  // return res.status(300).json({ message: "Yet to be implemented" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
