const express = require('express')
let books = require('./booksdb.js')
let isValid = require('./auth_users.js').isValid
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
	//Write your code here
	const username = req.body.username
	const password = req.body.password
	if (username && password) {
		if (!isValid(username)) {
			users.push({ username: username, password: password })
			return res.status(200).json({ message: `User ${username} registered` })
		} else {
			return res
				.status(400)
				.json({ message: `User ${username} already registered` })
		}
	} else {
		return res
			.status(404)
			.json({ message: 'Must provide username and password' })
	}
})

//Return books
function getBooks() {
	return new Promise((resolve, reject) => {
		resolve(books)
	})
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
	//Write your code here
	getBooks().then((bks) => res.send(JSON.stringify(bks)))
})

function getByISBN(isbn) {
	return new Promise((resolve, reject) => {
		let isbnNumber = parseInt(isbn)
		if (books[isbnNumber]) {
			resolve(books[isbnNumber])
		} else {
			reject({ status: 404, message: `ISBN ${isbn} not found` })
		}
	})
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
	//Write your code here
	getByISBN(req.params.isbn).then(
		(result) => res.send(result),
		(error) => res.status(error.status).json({ message: error.message })
	)
})

//Using Promise Get  books based on author
function getByAuthor(author) {
	return new Promise((resolve, reject) => {
		let authorName = parseInt(author)
		if (books[authorName]) {
			resolve(books[authorName])
		} else {
			reject({ status: 404, message: `Author Name ${author} not found` })
		}
	})
}

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
	//Write your code here
	const author = req.params.author
	getBooks()
		.then((bookEntries) => Object.values(bookEntries))
		.then((books) => books.filter((book) => book.author === author))
		.then((filteredBooks) => res.send(filteredBooks))
})

//Using Promise Get  books based on title
function getByTitle(title) {
	return new Promise((resolve, reject) => {
		let titleName = parseInt(title)
		if (books[titleName]) {
			resolve(books[titleName])
		} else {
			reject({ status: 404, message: `title ${title} not found` })
		}
	})
}

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
	//Write your code here
	const title = req.params.title
	getBooks()
		.then((bookEntries) => Object.values(bookEntries))
		.then((books) => books.filter((book) => book.title === title))
		.then((filteredBooks) => res.send(filteredBooks))
})

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
	//Write your code here
	const isbn = req.params.isbn
	getByISBN(req.params.isbn).then(
		(result) => res.send(result.reviews),
		(error) => res.status(error.status).json({ message: error.message })
	)
})


// TASK 10 - Get the book list available in the shop using promises
public_users.get('/books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

// TASK 11 - Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('No ISBN found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise is resolved");
   }).
        catch(function () { 
                console.log('No ISBN found');
  });

});


// TASK 12 - Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
    const get_books_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"]});
      resolve(res.send(JSON.stringify({booksbyauthor}, null, 4)));
      }
        else {
            reject(res.send('The mentioned author doesn\t exist'));
        }
    });
    });
    get_books_author.
        then(function(){
            console.log("Promise is resolved");
   }).
        catch(function () { 
                console.log('The mentioned author doesnt exist');
  });
  });


// TASK 13 - // Get all books based on title
public_users.get('/books/title/:title',function (req, res) {

    const get_books_title = new Promise((resolve, reject) => {

    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
    resolve(res.send(JSON.stringify({booksbytitle}, null, 4)));
      }

           else {
            reject(res.send('The mentioned book title doesnt exist'));
        }

    });

       });

    get_books_title.
        then(function(){
            console.log("Promise is resolved");
   }).
        catch(function () { 
                console.log('The mentioned book title doesnt exist');
  });

  });


module.exports.general = public_users
