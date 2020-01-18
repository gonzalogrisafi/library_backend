/* let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'db',
    user: 'library',
    password: 'library',
    database: 'library'
}); */

const util = require('util');
const con = require('./connection')
const query = util.promisify(con.query).bind(con);

const DAY_IN_MILSEC = 1000 * 60 * 60 * 24;

module.exports = {
    getBooks: () => {
        let result = query(`
            select * from books
        `);
        return result;
    },

    getBookId: (id) => {
        let result = query(
            `
            select b.id, b.title, b.amount, b.author, b.cover, b.amount - count(l.bookId) as availables, b.cover as cover
                from books b
                left join loans l
                    on b.id = l.bookId
                where b.id=?
                group by b.id, b.title, b.amount
            `, [id]
        )
        return result;
    },

    postBook: (title, author, amount, cover) => {
        let result = query(`
            insert into books (id, title, author, amount, cover)
            values (null, ?, ?, ?, ?)
        `, [title, author, amount, cover]);
        return result;
    },

    deleteBook: (id) => {
        let aux = query(`
            select *
                from loans l
                where l.bookId = ?`, [id]
        );
        if (aux.length == 0) {
            let result = query(` 
                delete b
                from books b
                where b.id = ?
            `, [id]
            );
            return result;
        }
        else {
            return false;
        }
    },

    putBook: async (id, amount) => {
        let aux = await query(
            `
            select count(b.id) as amount
                from loans l
                right join books b 
                    on l.bookId = b.id
                where b.id = ?
            group by b.id
            `, [id]
        );

        if (aux[0].amount < amount) {
            await query(`
                update books
                set amount = ?
                where id=?`, [amount, id]
            );
            return true;
        }
        return false;
    },

    findUsername: (username) => {
        let result = query (`
            select *
                from users u
                where u.username = ?
        `,[username]);
        return result;
    },

    findEmail: (email) => {
        let result = query (`
            select *
                from users u
                where u.email = ?
        `,[email]);
        return result;
    },

    findUser: (email, password) =>{
        let result = query(`
            select * 
                from users u
                where u.email = ?
                and   u.password = ?
            `,[email,password]);
        return result;
    },

    getUsers: () => {
        let result = query(`select * from users`);
        return result;
    },

    getUserId: (id) => {
        let result = query(
            `select *
                from users m
                where m.id=?`, [id]
        );
        return result;
    },

    postUser: (email,password,username) => {
        let result = query(
            `
            insert into users(id, email, password, rol, username)
            values(null,?,?,'USER',?)
            `, [email,password,username]
        )
        return result;
    },

    getLoans: () => {
        let result = query(`
            select * from loans;
        `);
        return result;
    },

    getLoansUser: async (id) => {
        let aux = await query(`
        select *
            from users m
            where m.id = ?
        `, [id]);
        if (aux.length > 0) {
            let result = query(`
            select l.id as loanId, l.userId as userId, l.bookId as bookId, l.expiracyDate as expiracyDate, b.title as title, b.author as author, b.cover as cover
                from loans l
                join books b
                    on l.bookId = b.id
                where l.userId = ?
            `, [id]);

            return result;
        }
        return null;
    },

    postLoan: async (userId, bookId, days) => {
        let debt = await query(`
            select *
            from loans l
                where l.userId = ?
            order by l.expiracyDate asc
            limit 1`, [userId]
        );
        if (debt.length > 0) {
            if (debt[0].expiracyDate < Date.now()) {
                return false;
            }
        }
        query(`
            insert into loans (id, userId, bookId, expiracyDate)
            values(null, ?, ?, ?)`, [userId, bookId, Date.now() + DAY_IN_MILSEC * days]
        );
        return true;
    },

    deleteLoan: (id) => {
        let result = query(`
            delete l
            from loans l
            where l.id = ?
        `, [id]);
        return result;
    }

}