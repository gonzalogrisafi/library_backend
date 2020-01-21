# REST API LIBRARY

REST API that manages a library, it includes books, members and loans management

# Overview
The API was made with Node.js and Express.js, to manage client's sessions it uses express-session and MySQL as session storage.

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
- [Books](#GET-Books)  
        - [GET Books](#Get-books)  
        - [GET Book by ID](#GET-booksid)  
        - [POST Book](#POST-books)  
        - [DELETE Book](#DELETE-book)  
        - [PUT Book](#PUT-booksid)
- [Members](#GET-Members)  
        - [GET Members](#GET-Members)  
        - [GET Member by ID](#GET-membersid)  
        - [POST Member](#POST-members)   
- [Loans](#GET-loans)  
        - [GET Loans](#GET-loans)  
        - [GET Loan by Member ID](#GET-loansid)  
        - [POST Loan](#POST-loans)  
        - [DELETE Loan](#DELETE-loansid)  

 ### **Get */books/***
Obtain all the books
```css
localhost:8080/books
```
- #### **Example Response**
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

### **GET */books/:id***
```css
localhost:8080/books/:id
```
- **Path Variables:**
```css
id:        id of the book to be searched
```
 ### **Example Response**
- **200 OK** 
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
- **404 NOT FOUND** 
```json
{
    "error": {
        "code": 404,
        "message": "book not found"
    }
}
```

### **POST */books/***
```css
localhost:8080/books
```
- #### Body
```json
{
	"title":"Don Quijote",
	"amount":100
}
```
### **Example Response**
- **200 OK**
```json
{
    "code":201,
    "message": "Book Added"
}
```
- **400 BAD REQUEST**
```json
{
    "error": {
        "code": 400,
        "message": "wrong parameters"
    }
}
```
- **400 BAD REQUEST**
```json
{
    "error": {
        "code": 400,
        "message": "there's already another book with that id"
    }
}
```

## **DELETE */book/***
```css
localhost:8080/books/:id
```
#### Path Variables
```css
id: ID of the book to be deleted
```
### **Example Response**
- **Case 200 OK**
```json
{
    "code":200,
    "message": "book deleted"
}
```
- **404 NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "book not found"
    }
}
```
- **Case 403 FORBIDDEN**
```json
{
    "error": {
        "code": 403,
        "message": "cannot delete the book due to there are borrowed copies"
    }
}
```

## **PUT */books/:id***
```css
localhost:8080/libros/:idLibro
```
#### Path Variables
```css
id: ID of the book to update amount of copies
```
#### Body
```json
{
	"bookId":100,
	"amount":20
}
```
### **Example Response**
- **Case 200 OK**
```json
{
    "code":200,
    "message": "amount of copies of book with id: {id} updated successfully"
}
```
- **Case 404 NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "book not found"
    }
}
```
- **Case 403 FORBIDDEN**
```json
{
    "error": {
        "code": 403,
        "message": "wrong amount of books"
    }
}
```
- **Case 400 BAD REQUEST**
```json
{
    "error": {
        "code": 400,
        "message": "wrong parameters"
    }
}
```

## **GET */members/***
Obtain all the library's members
```css
localhost:8080/members
```
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

## **GET */members/:id***
```css
localhost:8080/members/:id
```
**Path Variables:**
```css
id: id of the member to search
```
### **Example Response**
- **Case 200 OK**
```json
{
    "code":200,
    "data": {
        "id": 1,
        "name": "A"
    }
}
```
- **Case 404 NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "Member not found"
    }
}
```

## **POST */members/***
```css
localhost:8080/members
```
#### Body
```json
{
	"id":3,
	"name":"member 3"
}
```
### **Example Response**
```json
{
    "code":200,
    "message": "Member created successfully"
}
```

## **GET */loans/***
```css
localhost:8080/loans
```
### **Example Response**
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

## **GET */loans/:id***
Obtains all the loans made by a member via his id
```css
localhost:8080/loans/:id
```
**Path Variables:**
```css
id: member's id to search all the loans made by him
```
### **Example Response**
- ***Case* 200 OK**
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
- ***Case* 404 NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "Member not found"
    }
}
```

## **POST */loans/***
```css
localhost:8080/loans
```
### **Body**
```json
{
	"memberId":1,
	"bookId":10,
	"days":5
}
```
### **Example Response**
- **Case 200 OK**
```json
{
    "code":200,
    "message": "loan of book with id {id} created successfully"
}
```
- **Case Member has Unreturned Books**
```json
{
    "error": {
        "code": 400,
        "message": "member {id} has unreturned books"
    }
}
```
- **Case Wrong Days**
```json
{
    "error": {
        "code": 400,
        "message": "wrong number of days"
    }
}
```
- **Case No Available Copies**
```json
{
    "error": {
        "code": 400,
        "message": "there are no available copies of Book {id} available for loan"
    }
}
```
- **Case 404 Member NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "member not found"
    }
}
```
- **Case 404 Book NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "book not found"
    }
}
```

## **DELETE */loans/:id***
```css
localhost:8080/loans/:id
```
### **Path Variables**
```css
id: loan id to be deleted
```
### **Example Response**
- **Case 200 OK**
```json
{
    "code":200,
    "message": "loan deleted successfully"
}
```
- **Case 404 NOT FOUND**
```json
{
    "error": {
        "code": 404,
        "message": "loan not found"
    }
}
```
