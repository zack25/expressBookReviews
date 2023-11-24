let books = {
  1: { "author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": {} },
  2: { "author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
  3: { "author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {} },
  4: { "author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {} },
  5: { "author": "Unknown", "title": "The Book Of Job", "reviews": {} },
  6: { "author": "Unknown", "title": "One Thousand and One Nights", "reviews": {} },
  7: { "author": "Unknown", "title": "Nj\u00e1l's Saga", "reviews": {} },
  8: { "author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} },
  9: { "author": "Honor\u00e9 de Balzac", "title": "Le P\u00e8re Goriot", "reviews": {} },
  10: { "author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, the trilogy", "reviews": {} }
}

/**
 * 
 * @param {string} prop 
 * @param {string} propVal 
 * @returns array of book objects that have a property of the provided prop that has a value matching propVal
 *  if prop is null, then a list of all the book objects is provided
 *
 */
function findBooksByProp(prop, propVal) {

  return new Promise((resolve, reject) => {
    let foundBooks = [];

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

    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      let msg = "No books found";
      if (prop) {
        msg += ` for ${prop}:  ${propVal}`;
      }
      reject(new Error(msg));
    }
  });
}

function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    if (books.hasOwnProperty(isbn)) {
      resolve(books[isbn]);
    } else {
      reject(new Error(`No book found with ISBN: ${isbn}`));
    }
  });
}

function setUserBookReview(isbn, user, review) {
  getBookByISBN(isbn).then((book) => {
    book.reviews[user] = review;
  }).catch((error)=> {
    return error.message;
  });
}

async function deleteUserBookReview(isbn, user) {
  return new Promise((resolve, reject) => {

    getBookByISBN(isbn).then((book) => {
      if (book.reviews.hasOwnProperty(user)) {
        delete book.reviews[user];
      } 
      resolve(`Review by ${user} deleted`);
    }).catch((error)=> {
      reject(error.message);
    });
  });
}

module.exports.books = books;
module.exports.findBooksByProp = findBooksByProp;
module.exports.getBookByISBN = getBookByISBN;
module.exports.setUserBookReview = setUserBookReview;
module.exports.deleteUserBookReview = deleteUserBookReview;