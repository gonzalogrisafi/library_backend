# REST API LIBRARY

REST API that manages a library, it includes books, members and loans management

# Overview
The API was made with Node.js and Express.js, to manage client's sessions it uses express-session and MySQL as session storage.

# Installation
## Requirements
* npm
* node >= 8
* MySQL ~5.7

```
 git clone https://github.com/gonzagrisa/library_backend
 cd api-js-mooc
 npm install
```

## Run application
```
node index.js
```

# Response Status Codes
|Code|Description |
|--|--|
| 200 | Success! |
|400  | The query contains errors. In the event that a request was created using a form and contains user generated data, the user is  notified that the data must be corrected before the query is repeated |
|401  | There was an unauthorized attempt to use functionality available only to authorized users.|
|403  | The request is understood, but it has been refused due to permissions |
|404  | An attempt to invoke a non-existent object, such as a method or a book not found|
|500 | Something is broken|

# Error Messages
Error messages are returned in JSON format. For example, an error might look like this:
```
{
    "error":{
        "code": 404
        "message": "Sorry, that page does not exist",
    }
}
```

# Endpoints
### Books   
- [Get all Books](#Get-books)  
- [Get Book by ID](#GET-booksid)  
- [Create Book](#POST-books)  
- [Delete Book](#DELETE-book)  
- [Update Book](#PUT-booksid)
### Users  
- [Get Users](#GET-users)  
- [Get User by ID](#GET-usersid)  
- [Signup](#POST-signup)  
- [Login](#POST-login)  
- [Logout](#POST-logout)  
- [Check Email](#GET-signupcheckEmail-email)  
- [Check Username](#GET-signupcheckUsername-username)
### Loans
- [Get Loans](#GET-loans)  
- [Get Loan by User ID](#GET-loansid)  
- [Create Loan](#POST-loans)  
- [Delete Loan](#DELETE-loansid)  

# Books

## `Get` /books

```css
localhost:8080/books
```
Get the list of books in database

### **Example Response**
```json
{
    "code":200,
    "data": [
        {
            "id": 10,
            "title": "Harry Potter",
            "amount": 100
        },
        {
            "id": 20,
            "title": "Lord of the Rings",
            "amount": 10
        }
    ]
}
```

## `GET` /books/{id}
```css
localhost:8080/books/:id
```
Gets the book's info by its id
 
* ### **Parameters**

||Type|Description |
|:----:|------|------|
| `id` |integer| Unique identifier for the object |

### **Example Response**
* #### `200 OK`
```json
{
    "code":200,
    "data": {
        "bookId": 10,
        "title": "Harry Potter",
        "available": 100
    }
}
```
* #### `404 NOT FOUND`
```json
{
    "error": {
        "code": 404,
        "message": "Book not found"
    }
}
```
## `POST` /books
```css
localhost:8080/books
```
Save a new book in the database
### **Request Body**
```json
{
	"title":"Don Quijote",
	"amount":100
}
```
### **Example Response**
- #### `200 OK`
```json
{
    "code":201,
    "message": "Book Added"
}
```
- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Wrong parameters"
    }
}
```
- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```
- #### `403 FORBIDDEN`
```json
{
    "error": {
        "code": 403,
        "message": "You must be an admin to perform this action"
    }
}
```

## `DELETE` /books/{id}
```css
localhost:8080/books/:id
```
Delete a Book from database by its id

* ### **Parameters**

||Type|Description |
|:----:|------|------|
| `id` |integer| Book's unique identifier|

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Book deleted"
}
```
- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Cannot delete the book due to there are borrowed copies"
    }
}
```
- #### `404 NOT FOUND`
```json
{
    "error": {
        "code": 404,
        "message": "Book not found"
    }
}
```
- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```

- #### `403 FORBIDDEN`
```json
{
    "error": {
        "code": 403,
        "message": "You must be an admin to perform this action"
    }
}
```
## `PUT` /books/{id}
```css
localhost:8080/books/{id}
```
Update a book's amount of copies by its id
* ### **Parameters**
||Type|Description |
|:----:|------|------|
| `id` |integer| Book's unique identifier|

### **Request Body**
```json
{
	"bookId":2,
	"amount":100
}
```
### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "amount of copies of book with id: {id} updated successfully"
}
```
* #### `404 NOT FOUND`
```json
{
    "error": {
        "code": 404,
        "message": "Book not found"
    }
}
```
- #### `403 FORBIDDEN`
```json
{
    "error": {
        "code": 403,
        "message": "You must be an admin to perform this action"
    }
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Wrong parameters"
    }
}
```

## `GET` /users
```css
localhost:8080/users
```
Obtain a list of the library's users

### **Example Response**
```json
{
    "code":200,
    "data": [
        {
            "id": 1,
            "name": "A"
        },
        {
            "id": 2,
            "name": "B"
        }
    ]
}
```

## `GET` /users/{id}
```css
localhost:8080/users/:id
```
Get a user's info by its id

* ### **Parameters**
||Type|Description |
|:----:|------|------|
| `id` |integer| User's unique identifier|

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "data": {
        "id": 1,
        "name": "A"
    }
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Couldn't Log Out"
    }
}
```

## `POST` /signup
```css
localhost:8080/signup
```
Create a new user in the database with rol: "USER"
### **Request Body**
```json
{
	"email":"abc@gmail.com",
	"username":"abc",
	"password":"secret"
}
```
### **Example Response**
```json
{
    "code":200,
    "message": "User Created Successfully"
}
```

## `POST` /login
```css
localhost:8080/login
```
Create a session

### **Request Body**
```json
{
    "email": "max@gmail.com",
    "password": "secret"
}
```

### **Example Response**
- #### `200 OK`
```json
{
    "code": 200,
    "userId": 2,
    "rol": "ADMIN",
    "message": "Logged In"
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Incorrect User or Password"
    }
}
```

## `POST` /logout
```css
localhost:8080/logout
```
Delete a user's session

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Logged Out"
}
```
- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Couldn't Log Out"
    }
}
```
- #### `500 INTERNAL SERVER ERROR`
```json
{
    "error": {
        "code": 400,
        "message": "Error destroying session"
    }
}
```

## `GET` /signup/checkEmail/ {email}
```css
localhost:8080/signup/checkEmail/{email}
```
Checks if an email is already in database

* ### **Parameters**
||Type|Description |
|:----:|------|------|
| `email` |string| Email to check if it's available |

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Email available"
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Email already in use"
    }
}
```


## `GET` /signup/checkUsername/ {username}
```css
localhost:8080/signup/checkUsername/{username}
```
Checks if a username is already in database

* ### **Parameters**
||Type|Description |
|:----:|------|------|
| `username` |string| Username to check if it's available |

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Username available"
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "Username already in use"
    }
}
```


## `GET` /loans
```css
localhost:8080/loans
```
Get a list of all the currently active loans made

### **Example Response**

- #### `200 OK`
```json
{
    "code":200,
    "data": [
        {
            "id": 1,
            "memberId": 1,
            "bookId": 10,
            "expiracyDate": 1567900080238
        },
        {
            "id": 2,
            "memberId": 2,
            "bookId": 10,
            "expiracyDate": 1567900080238
        }
    ]
}
```

- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```
- #### `403 FORBIDDEN`
```json
{
    "error": {
        "code": 403,
        "message": "You must be an admin to perform this action"
    }
}
```

## `GET` /loans/{id}
```css
localhost:8080/loans/:id
```
Obtains all the loans made by a member by his id
**Path Variables:**
```css
id: member's id to search all the loans made by him
```
### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "data": [
        {
            "bookId": 10,
            "expiracyDate": "2019-09-07T23:48:00.238Z"
        }
    ]
}
```
- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 404,
        "message": "User not found"
    }
}
```

- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```
- #### `403 FORBIDDEN`
```json
{
    "error": {
        "code": 403,
        "message": "You must be an admin to perform this action"
    }
}
```

## `POST` /loans/
```css
localhost:8080/loans
```
Creates a new loan in the database

### **Request Body**
```json
{
	"memberId":1,
	"bookId":1,
	"days":1
}
```

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Loan of book with id {id} created successfully"
}
```

- #### `400 BAD REQUEST`
```json
{
    "error": {
        "code": 400,
        "message": "User 1 has unreturned books"
    }
}
```
```json
{
    "error": {
        "code": 400,
        "message": "Wrong Number of Days"
    }
}
```
- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```

## `DELETE` /loans/{id}
```css
localhost:8080/loans/{id}
```
Deletes a loan from database

* ### **Parameters**

||Type|Description |
|:----:|------|------|
| `id` |integer| Book's unique identifier |

### **Example Response**
- #### `200 OK`
```json
{
    "code":200,
    "message": "Loan deleted successfully"
}
```
* #### `404 NOT FOUND`
```json
{
    "error": {
        "code": 404,
        "message": "loan not found"
    }
}
```
- #### `401 UNAUTHORIZED`
```json
{
    "error": {
        "code": 401,
        "message": "You must be logged in and be an admin to perform this action"
    }
}
```
