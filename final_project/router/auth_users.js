const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = [
	{
		username: 'user1',
		password: 'user1',
	},
	{
		username: 'user2',
		password: 'user2',
	},
	{
		username: 'user3',
		password: 'user3',
	},
]

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


const authenticatedUser = (username, password) => {
	let validusers = users.filter((user) => {
		return user.username === username && user.password === password
	})
	if (validusers.length > 0) {
		return true
	} else {
		return false
	}
}
//write code to check if username and password match the one we have in records.

//only registered users can login
regd_users.post('/login', (req, res) => {
	//Write your code here
	const username = req.body.username
	const password = req.body.password

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign({ data: password }, 'access', {
			expiresIn: 3600,
		})
		req.session.authorization = { accessToken, username }
		return res.status(200).send('User successfully logged in')
	} else {
		return res.status(208).json({ message: 'Invalid username or password' })
	}
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const review = req.body.review
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		book.reviews[username] = review
		return res.status(200).send('Review successfully posted')
	} else {
		return res.status(404).json({ message: `ISBN ${isbn} not found` })
	}
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		delete book.reviews[username]
		return res.status(200).send('Review successfully deleted')
	} else {
		return res.status(404).json({ message: `ISBN ${isbn} not found` })
	}
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
