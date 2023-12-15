const express = require("express");
const session = require('express-session');
//const filterSelection = require('./cards.js'); 
var parseUrl = require('body-parser');
const app = express();
const path = require("path");
const port = 3000;
const sql = ("mysql");
const mime = require('mime');
const filePath = path.join(__dirname, './cards.js');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    sameSite: 'none'
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(filePath)));
app.set('view engine', 'ejs');
let mysql = require('mysql');

const { name } = require("ejs");

const { get } = require("http");
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mpollo',
    port: '3306',
});
connection.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.get('/cards.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(filePath, {
        headers: {
            'Content-Type': 'text/javascript'
        }
    });
});



app.get('/cards', (req, res) => {
    let memberId = req.body.memberId
    let sessObj = req.session;
    let title = "Trading The Cart";

    try{
    let getMembers = 'SELECT memberId FROM members where username = (?)'
    connection.query(getMembers, [sessObj.username], (err, result) => {
        if (err) throw err;


        let base = "SELECT pokemonimages.Image, pokemoninfo.* FROM pokemoninfo LEFT JOIN pokemonimages ON pokemonimages.id = pokemoninfo.id"
        connection.query(base, (err, rows) => {
            if (err) throw err;
            //res.send(`<code>${row}</code>`);
            if (sessObj.loggedIn) {
                res.render('pages/cards', { tdata: title, pokemon: rows, loggedIn: sessObj.loggedIn, username: sessObj.username, memberId: result[0].memberId });
            } else {
                res.render('pages/cards', { tdata: title, pokemon: rows, loggedIn: sessObj.loggedIn, username: sessObj.username });
            }
        });
    });
}catch (error) { res.redirect('/menu') }
});

app.get('/singleCard', (req, res) => {
    let sessObj = req.session;
    let title = "Card Details";
    let id = req.query.id;
try{
    let getMembers = 'SELECT memberId FROM members where username = (?)'
    connection.query(getMembers, [sessObj.username], (err, result) => {
        if (err) throw err;

        let info = `SELECT pokemonimages.Image, pokemoninfo.* FROM pokemoninfo LEFT JOIN pokemonimages ON pokemonimages.id = pokemoninfo.id WHERE pokemoninfo.id = '${id}' ORDER BY id`
        //`SELECT * FROM pokemoninfo WHERE id = '${id}'`;

        connection.query(info, (err, rows) => {
            if (err) throw err;

            res.render('pages/singleCard', { tdata: title, pokemon: rows, loggedIn: sessObj.loggedIn, username: sessObj.username });
        });

    });
}catch (error) { res.redirect('/menu') }
});
app.get('/', (req, res) => {
    let sessObj = req.session;
    let title = "Trading The Cart";
    res.render('pages/menu', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });
});

app.get('/menu', (req, res) => {
    let sessObj = req.session;
    let title = "Trading The Cart";
    res.render('pages/menu', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });
});

app.get('/login', (req, res) => {
    let sessObj = req.session;
    let title = "Login";
    res.render('pages/login', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });
});

app.get('/logout', (req, res) => {
    let sessObj = req.session;
    sessObj.destroy()
    res.redirect('/login');
});

app.get('/addcard', (req, res) => {
    let sessObj = req.session;
    //var sql = `INSERT INTO membercollection(localId, memberId, image) VALUES (?, ?, ?)`;
    try {
        let getMembers = 'SELECT memberId FROM members where username = (?)'
        connection.query(getMembers, [sessObj.username], (err, result) => {
            if (err) throw err;
            if (sessObj.username) {

                let title = "Trading The Cart";
                res.render('pages/addCard', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn, memberId: result[0].memberId });
            } else {
                res.redirect('/login')
            }
            //});
        });
    } catch (error) {
        res.redirect('/menu')
    }
});
app.get('/membercollection', (req, res) => {
    let sessObj = req.session;
    let title = "Collection";

    
        let getMembers = 'SELECT memberId FROM members where username = ?'
    try {
        connection.query(getMembers, [sessObj.username], (err, result) => {
            let base = `SELECT pokemonimages.image, membercollection.*, pokemoninfo.* FROM pokemoninfo Left JOIN membercollection on membercollection.id = pokemoninfo.id INNER JOIN pokemonimages on pokemonimages.id = pokemoninfo.id left join members on members.memberId = membercollection.memberId where membercollection.memberId = "${result[0].memberId}"`
            connection.query(base, (err, rows) => {
                if (err) throw err;

                res.render('pages/membercollection', { tdata: title, pokemon: rows, username: sessObj.username, loggedIn: sessObj.loggedIn, memberId: result[0].memberId });
            });
        });
    } catch (error) {
        res.redirect('/menu')
    }
});


app.get('/profile', (req, res) => {
    let sessObj = req.session;

    try {
        let getMembers = 'SELECT memberId FROM members where username = (?)'
        connection.query(getMembers, [sessObj.username], (err, result) => {
            if (err) throw err;
            if (sessObj.username) {
                let title = "Profile";
                res.render('pages/profile', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });
            } else {
                res.redirect('/login')
            }
        });
    } catch (error) {
        res.redirect('/menu')
    }
});

app.get('/settings', (req, res) => {

    let sessObj = req.session;
    let title = "Settings";

    res.render('pages/settings', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });

});
// http://localhost:3000/
let encodeUrl = parseUrl.urlencoded({ extended: false });
app.use(encodeUrl);

app.get('/register', (req, res) => {
    let sessObj = req.session;
    let title = "Register";
    res.render('pages/register', { tdata: title, username: sessObj.username, loggedIn: sessObj.loggedIn });

});

app.post('/register', (req, res) => {

    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var email = req.body.email;
    var password = req.body.password;
    let username = req.body.username;
    let sessObj = req.session;
try{
    // Insert new user data into 'members' table
    var sql = `INSERT INTO members (firstname, surname, username, email, password) VALUES (?, ?, ?, ?, ?)`;

    connection.query(sql, [firstname, surname, username, email, password], (err, result) => {
        if (err) throw err;
        sessObj.username = username;
        sessObj.loggedIn = true;
        res.redirect('/cards')
    });
}catch(error){
    res.redirect('/menu')
}
});

app.post('/login', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    let sessObj = req.session;
try{
    var sql = `SELECT * FROM members WHERE email = ?`;

    connection.query(sql, [email,], (err, result) => {
        if (err) throw err;
        try {
            if (result[0].password === password) {
                sessObj.username = result[0].username;
                sessObj.loggedIn = true;
                res.redirect('/profile')
            } else {
                res.redirect('/login')
            } if (result[0].password !== password)
                res.redirect('/login')
        } catch (error) {

            res.redirect('/login')
        }

    });
}catch(error){
res.redirect('/menu')
} 
});

app.post('/addCard', (req, res) => {
    let sessObj = req.session;
    let memberId = req.body.memberId;
    let pokemonname = req.body.pokemonname;
    let dexid = req.body.dexid;
    let rarity = req.body.rarity
    let hp = req.body.hp;
    let type = req.body.type;

    var sql = `INSERT INTO memberaddedcards (memberId, pokemonname, dexid, rarity, hp, type) VALUES (?, ?, ?, ?, ?,?)`;

    let getMembers = 'SELECT memberId, username FROM members where memberId = (?)'
    connection.query(getMembers, [memberId], (err, result1) => {

        connection.query(sql, [result1[0].memberId, pokemonname, dexid, rarity, hp, type], (err, result) => {
            if (err) throw err;
            res.redirect('/menu')
        });
    });
    {
        res.redirect('/menu')
    }
});
app.post('/cards', (req, res) => {
    let memberId = req.body.memberId
    let sessObj = req.session;
    let id = req.body.id;
    try {
        let getMembers = 'SELECT memberId, username FROM members where username = (?)'
        connection.query(getMembers, [sessObj.username], (err, result1) => {
            if (err) throw err;
            var sql = `INSERT INTO membercollection (memberId, id) VALUES (?,?)`

            connection.query(sql, [memberId, id], (err, result2) => {
                if (err) throw err;

                res.redirect('/membercollection')


            });
        });
    } catch (error) {
        res.redirect('/menu')
    }
});

app.post('/settings', (req, res) => {
    let memberId = req.body.memberId
    var email = req.body.email;
    var password = req.body.password;
    let username = req.body.username;
    let sessObj = req.session;
    let memberInfo = []
    memberInfo.push(password, email, username)
    try {
        let getMembers = 'SELECT memberId FROM members where username = (?)'
        connection.query(getMembers, [sessObj.username], (err, result) => {
            var sql = `UPDATE members SET password=?,email=?,username=? WHERE memberId = "${result[0].memberId}"`
            if (email !== "" && password !== "" && username !== "") {
                connection.query(sql, [password, email, username], (err, result1) => {
                    if (err) throw err;
                    sessObj.username = username;
                    sessObj.loggedIn = true;
                    res.redirect('/cards')

                });
            } else {
                res.redirect('/settings')
            }
        });
    } catch (error) {
        res.redirect('/menu')
    }
});

app.post('/membercollection/deletecard', (req, res) => {
    let id = req.body.id;
    let sessObj = req.session;
    try {
        let getMember = 'SELECT members.memberId, pokemoninfo.id FROM members INNER JOIN  membercollection on membercollection.memberId = members.memberId inner join pokemoninfo on pokemoninfo.id = membercollection.id where username = (?)'
        connection.query(getMember, [sessObj.username, id], (err, result) => {
            if (err) throw err;
            var sql = `DELETE FROM membercollection WHERE id = '${result[0].id}' and memberId =  "${result[0].memberId}"`
            connection.query(sql, [id], (err, result1) => {
                if (err) throw err;
                res.redirect('/membercollection')
            });
        });
    } catch (error) {
        res.redirect('/menu')
    }


});


app.listen(port, () => {

    console.log("app running");
});