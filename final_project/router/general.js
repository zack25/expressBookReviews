const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/**
 * 
 * @param {string} prop 
 * @param {string} propVal 
 * @returns array of book objects that have a property of the provided prop that has a value matching propVal
 *  if prop is null, then a list of all the book objects is provided
 *
 */
function FindBooksByDetail(prop, propVal) {

  return new Promise((resolve, reject) => {
    let foundBooks = [];

    if (prop == "isbn") {
      if (books.hasOwnProperty(propVal)) {
        foundBooks.push(books[propVal]);
      }
    } else {

      for (const isbn in books) {
        let curBook = books[isbn];
        if (prop) {

          if (books[isbn][prop] == propVal) {
            foundBooks.push(curBook);
          }

        } else if (prop == null) {
          foundBooks.push(books[isbn]);
        }
      }
    }
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      let msg = "No books found";
      if (prop){
        msg += ` for ${prop}:  ${propVal}`;
      }
      reject(new Error(msg));
    }
  });
  // });
  // return foundBooks;
}

public_users.post("/register", (req, res) => {
  //Write your code here
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
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here

  let bookTitles = await FindBooksByDetail(null);
  /* let bookTitles = [];
   for (const isbn in books) {
     bookTitles.push(books[isbn]);
   }*/
  return res.status(200).send(JSON.stringify(bookTitles, ["title", "author"], 4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  // try {

  
  // let bookByIsbn = FindBooksByDetail("isbn", isbn); //retrieveByIsbn
  FindBooksByDetail("isbn",isbn)
  .then((book) => {

    return res.status(200).send(JSON.stringify(book, null, 4));
  })
  .catch((error) => {
    return res.status(200).json({message: error.message})
  });
  // } catch(e){

    // return res.status(200).json({ message: e.message /*"ISBN not found"*/ });
  // }

  /*if (booksByIsbn.hasOwnProperty(isbn)) {
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(200).json({ message: "ISBN not found" });
  }*/
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let author = req.params.author;
  let authorBooks = FindBooksByDetail("author", author);

  authorBooks.then((result) => {
    return res.status(200).send(JSON.stringify(result, null, 10));

  })
  .catch((error)=> {
    return res.status(200).json({ message: error.message }); //`No books found by author: ${author}` });

  });
  /*
  if (authorBooks.length > 0) {
    return res.status(200).send(JSON.stringify(authorBooks, null, 10));
  } else {
    //none found
    return res.status(200).json({ message: `No books found by author: ${author}` });
  }*/
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title;

  try {
  let foundBooks = await FindBooksByDetail("title", title);
  // if (foundBooks.length > 0) {
    return res.status(200).send(JSON.stringify(foundBooks, null, 10));
  // } else {
  }catch(error){

    return res.status(200).json({ message: error.message }); //`No books found with the title of: ${title} ` });
    // return res.status(200).json({ message: `No books found with the title of: ${title} ` });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (books.hasOwnProperty(isbn)) {
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 10));
  } else {
    return res.status(200).json({ message: `No book found with ISBN: ${isbn}` });
  }
  // return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
