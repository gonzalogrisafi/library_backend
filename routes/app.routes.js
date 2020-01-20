let handler = require("../handler/apphandler");

module.exports = app => {
    app.post("/login", (req,res)=> handler.login(req,res));
    app.post("/logout", (req,res)=> handler.logout(req,res));

    app.post("/signup", (req,res)=> handler.signup(req,res));
    app.get("/signup/checkEmail/:email", (req,res)=> handler.checkEmail(req,res));
    app.get("/signup/checkUsername/:username", (req,res)=> handler.checkUsername(req,res));

    app.get("/users", (req, res) => handler.getUsers(req, res));
    app.get("/users/:id", (req, res) => handler.getUserId(req, res));
    app.post("/users", (req, res) => handler.postUser(req, res));

    app.get("/books", (req, res) => handler.getBooks(req, res));
    app.get("/books/:id", (req, res) => handler.getBookId(req, res));
    app.get("/book/loans/:id", (req,res) => handler.getBookLoans (req,res));
    app.post("/books", (req, res) => handler.postBook(req, res));
    app.delete("/books/:id", (req, res) => handler.deleteBook(req, res));
    app.put("/books", (req, res) => handler.putBook(req, res));

    app.get("/loans", (req, res) => handler.getLoans(req, res));
    app.get("/loans/:id", (req, res) => handler.getLoansUser(req, res));
    app.post("/loans", (req, res) => handler.postLoan(req, res));
    app.delete("/loans/:id", (req, res) => handler.deleteLoan(req, res));
}