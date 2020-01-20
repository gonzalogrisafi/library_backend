const validator = require('../lib/validators');
const query = require('../lib/queries');

module.exports = {
    /////////////////////////////// USER LOGIN/LOGOUT/SIGNUP /////////////////////////////////////
    login: async (req, res) => {
        console.log(`-  POST /login/`);
        console.log(req.session);
        if (!req.session.loggedIn) {
            let result = await query.findUser(req.body.email, req.body.password);
            console.log(result);
            if (result.length > 0) {
                req.session.userId = result[0].id;
                req.session.loggedIn = true;
                req.session.rol = result[0].rol;
                console.log(req.session);
                res.status(200).json({
                    code: 200,
                    userId: req.session.userId,
                    rol: req.session.rol,
                    message: "Logged In"
                })
            } else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "Bad Request"
                    }
                });
            }
        } else {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "Bad Request"
                }
            });
        }
    },

    logout: (req, res) => {
        console.log(`-   POST /logout/`);
        if (!req.session.loggedIn) {
            res.status(400).json({
                code: 400,
                message: "Couldn't Log Out"
            });
        }
        else {
            req.session.destroy(err => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        code: 500,
                        message: "Error destroying session"
                    });
                }
                else {
                    res.status(200).json({
                        code: 200,
                        message: "Logged Out"
                    });
                }
            });
        }
    },

    signup: async (req, res) => {
        console.log(" - POST /signup/");
        await query.postUser(req.body.email, req.body.password, req.body.username);
        res.status(200).json({
            code: 200,
            message: "User Created Successfully"
        });
    },

    checkEmail: async (req, res) => {
        console.log(`-   CHECK IF EMAIL ALREADY IN USE`);
        let result = await query.findEmail(req.params.email);
        if (result.length > 0) {
            console.log(`-   EMAIL ALREADY IN USE`);
            res.status(400).json({
                code: 400,
                message: "Email already in use"
            });
        } else {
            console.log(`-   EMAIL AVAILABLE`);
            res.status(200).json({
                code: 200,
                message: "Email available"
            })
        }
    },

    checkUsername: async (req, res) => {
        console.log(`-   CHECK IF USERNAME ALREADY IN USE`);
        console.log(req.params);
        let result = await query.findUsername(req.params.username);
        if (result.length > 0) {
            console.log(`-   USERNAME ALREADY IN USE`);
            res.status(404).json({
                code: 404,
                message: "Username already in use"
            });
        } else {
            console.log(`-   USERNAME AVAILABLE`);
            res.status(200).json({
                code: 200,
                message: "Username available"
            })
        }
    },

    ////////////////////////// BOOKS //////////////////////////////////
    getBooks: async (req, res) => {
        console.log(`- GET /books/`);
        let result = await query.getBooks();
        res.status(200).json({
            code: 200,
            count: result.length,
            data: result
        });
    },

    getBookId: async (req, res) => {
        console.log("- GET /book/:id");
        let book = await query.getBookId(req.params.id);
        if (book.length > 0) {
            res.status(200).json({
                code: 200,
                data: {
                    book
                }
            });
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "book not found"
                }
            });
        }
    },

    getBookLoans: async (req,res) => {
        console.log("- GET /book/loans/:id");
        let loansBook = await query.getBookLoans(req.params.id);
        res.status(200).json({
            code: 200,
            count: loansBook.length,
            data: loansBook
        });
    },


    postBook: async (req, res) => {
        console.log("- POST /Book/")
        if (req.session.loggedIn && req.session.rol == 'admin') {
            if (validator.validateBook(req.body.title, req.body.amount)) {
                await query.postBook(req.body.title, req.body.author, req.body.amount, req.body.cover);
                res.status(201).json({
                    code: 201,
                    message: "book added"
                });
            }
            else {
                console.log("PARAMETROS INCORRECTOS");
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "wrong parameters"
                    }
                })
            }
        }
        else if (req.session.loggedIn && req.session.rol == 'user') {
            res.status(403).json({
                error: {
                    code: 403,
                    message: "You must be an admin to perform this action"
                }
            })
        }
        else {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in and be an admin to perform this action"
                }
            });
        }
    },

    //deleteBook deletes a book via its id, if the book was deleted then the number of affected rows is 1
    deleteBook: async (req, res) => {
        console.log("- DELETE /book/:id")
        console.log(req.params);
        if (req.session.loggedIn && req.session.rol == 'admin') {
            const book = await query.getBookId(req.params.id);
            console.log(book);
            if (book.length == 0) {
                console.log("book not found");
                res.status(404).json({
                    error: {
                        code: 404,
                        message: "Book not found"
                    }
                });
            }
            let result = await query.deleteBook(req.params.id);
            if (result) {
                res.status(200).json({
                    code: 200,
                    message: "Book deleted"
                });
            }
            else if (!result){
                res.status(400).json(
                    {
                        error: {
                            code: 400,
                            message: "Cannot delete the book due to there are borrowed copies"
                        }
                    })
            }
        }
        else if (req.session.loggedIn && req.session.rol == 'user') {
            res.status(403).json({
                error: {
                    code: 403,
                    message: "You must be an admin to perform this action"
                }
            })
        }
        else {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in and be an admin to perform this action"
                }
            });
        }
    },

    putBook: async (req, res) => {
        console.log("- PUT /books/");
        console.log(req.body);
        if (req.session.loggedIn && req.session.rol == 'admin') {
            if (validator.validateBookUpdate(req.body.bookId, req.body.amount)) {
                let book = await query.getBookId(req.body.bookId);
                if (book.length == 0) {
                    res.status(404).json({
                        error: {
                            code: 404,
                            message: "Book not found"
                        }
                    });
                }
                else if (await query.putBook(req.body.bookId, req.body.amount)) {
                    res.status(200).json({
                        code: 200,
                        message: `Amount of copies of book with id: ${req.body.bookId} updated successfully`
                    });
                }
                else {
                    res.status(404).json({
                        error: {
                            code: 404,
                            message: "Wrong amount of books"
                        }
                    });
                }
            }
            else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: "Wrong parameters"
                    }
                });
            }
        }
        else if (req.session.loggedIn && req.session.rol == 'user') {
            res.status(403).json({
                error: {
                    code: 403,
                    message: "You must be an admin to perform this action"
                }
            })
        }
        else {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in and be an admin to perform this action"
                }
            });
        }
    },

    //getUsers makes a query to get all the users registered
    getUsers: async (req, res) => {
        console.log(`- GET /users/`);
        let result = await query.getUsers();
        res.status(200).json({
            code: 200,
            data: result
        });
    },

    //getUserId finds a User by his id
    getUserId: async (req, res) => {
        console.log(`- GET /user/${req.params.id}`);
        let user = await query.getUserId(req.params.id);
        if (user.length > 0) {
            res.status(200).json({
                code: 200,
                data: user
            });
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "User not found"
                }
            });
        }
    },

    postUser: async (req, res) => {
        console.log("- POST /users/")
        if (req.body.name != null) {
            await query.postUser(req.body.name);
            res.status(201).json(
                {
                    code: 201,
                    message: `User created successfully`
                });
        }
        else {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "Incorrect Parameters"
                }
            });
        }
    },

    getLoans: async (req, res) => {
        console.log(`- GET /loans/`);
        let result = await query.getLoans();
        res.status(200).json({
            code: 200,
            data: result
        });
    },

    getLoansUser: async (req, res) => {
        console.log(`- GET /loans/:id`);
        if (req.session.loggedIn) {
            let result = await query.getLoansUser(req.params.id);
            console.log(result);
            if (result) {
                res.status(200).json({
                    code: 200,
                    data: result
                });
            }
            else {
                res.status(404).json(
                    {
                        error: {
                            code: 404,
                            message: "User not found"
                        }
                    })
            }
        }
        else {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in to perform this action"
                }
            })
        }
    },

    postLoan: async (req, res) => {
        console.log("- POST /loans/");
        console.log(req.body);
        if (!req.session.loggedIn) {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in to perform this action"
                }
            });
        }
        else if (!validator.validateDays(req.body.days)) {
            res.status(400).json({
                error: {
                    code: 400,
                    message: "Wrong Number of Days"
                }
            });
        }
        else {
            let result = await query.postLoan(req.session.userId, req.body.bookId, req.body.days);
            if (result) {
                res.status(200).json({
                    code: 200,
                    message: `loan of book with id ${req.body.bookId} created successfully`
                });
                return;
            }
            else {
                res.status(400).json({
                    error: {
                        code: 400,
                        message: `User ${req.session.userId} has unreturned books`
                    }
                });
            }
        }
    },

    deleteLoan: async (req, res) => {
        console.log("- DELETE /loans/:id");
        if (!req.session.loggedIn) {
            res.status(401).json({
                error: {
                    code: 401,
                    message: "You must be logged in to perform this action"
                }
            })
        }
        let result = await query.deleteLoan(req.params.id);
        if (result.affectedRows == 1) {
            res.status(204).json({
                code: 204,
                message: "Loan deleted successfully"
            });
        }
        else {
            res.status(404).json({
                error: {
                    code: 404,
                    message: "loan not found"
                }
            })
        }
    }
}