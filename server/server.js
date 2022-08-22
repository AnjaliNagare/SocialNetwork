const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

const { SESSION_SECRET } = require("../secrets.json");
const cookieSession = require("cookie-session");

app.use(compression());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14, // two weeks of cookie validity
    })
);

app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

const { createUser, getUserById, login } = require("./db");

app.get("/api/users/me", (request, response)=> {
    if (!request.session.user_id) {
        response.json("null");
        return;
    }
    getUserById(request.session.user_id).then((result) =>{
        console.log(result);
        response.json(result);
    });
});

app.post("/api/users", (request, response) => {
    createUser(request.body)
        .then(newUser => {
            console.log(newUser);
            request.session.user_id = newUser.id;
            response.json(newUser);
        }).catch(error => {
            console.log('POST /api/users', error);
            if (error.constraint === "user_email_key") {
                response.status(400).json({ error: "E-mail already in use" });
                return;
            }
            response.status(500).json({ error: 'Something went wrong' });
        });
});

app.post("/api/login", (request, response) => {
    console.log("post /login", request.body);

    login(request.body)
        .then((foundUser) => {
            if(!foundUser) {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
            request.session.user_id = foundUser.id;
            response.json("foundUser");
        })
        .catch((error) => {
            console.log("post/api/login", error);
            response.status(500).json( {
                error: "Error logging user",
            });
        });
});

app.post("/logout",(request, response) => {
    request.session = null;
    response.json({message: "User Logout"});
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
