const express = require('express');
let findBooksByProp = require("./booksdb.js").findBooksByProp;
let getBookByISBN = require("./booksdb.js").getBookByISBN;
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {

  let requestUser = req.body.username;
  let password = req.body.password;
  if (!requestUser || !password) {
    return res.status(404).json({ message: `Error registering user` });
  }
  else if (isValid(requestUser)) {
    return res.status(404).json({ message: `Username ${requestUser} has already been taken` });
  } else {
    users.push({ username: requestUser, "password": password });
    return res.status(200).json({ message: `User successfully registered` });
  }

});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {

  try {
    let bookTitles = await findBooksByProp(null);

    return res.status(200).send(JSON.stringify(bookTitles, ["title", "author"], 4));
  } catch (error) {
    return res.status(200).send({ message: error.message });
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {

      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(200).json({ message: error.message })
    });

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  let authorBooks = findBooksByProp("author", author);

  authorBooks.then((result) => {
    return res.status(200).send(JSON.stringify(result, null, 10));

  })
    .catch((error) => {
      return res.status(200).json({ message: error.message });

    });

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

  let title = req.params.title;

  try {
    let foundBooks = await findBooksByProp("title", title);

    return res.status(200).send(JSON.stringify(foundBooks, null, 10));

  } catch (error) {

    return res.status(200).json({ message: error.message });
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  let isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then((book) => {

      return res.status(200).send(JSON.stringify(book.reviews, null, 10));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });

    });

});

module.exports.general = public_users;
