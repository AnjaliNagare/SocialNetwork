const spicedPg = require("spiced-pg");
const bcrypt = require("bcryptjs");

const { DATABASE_USER, DATABASE_PASSWORD } = require("../secrets.json");

const DATABASE_NAME = "social-network";

// connection to the db
const db = spicedPg(
    `postgres:${DATABASE_USER}:${DATABASE_PASSWORD}@localhost:5432/${DATABASE_NAME}`
);

const hash = (password) =>
    bcrypt.genSalt().then((salt) => bcrypt.hash(password, salt));

function createUser({ first_name, last_name, email, password }) {
    return hash(password).then((password_hash) => {
        return db
            .query(
                
                `INSERT INTO users
                (first_name, last_name, email, password_hash)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [first_name, last_name, email, password_hash]
            )
            .then((result) => result.rows[0]);
    });
}    

function getUserById(id) { 
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then((result) => result.rows[0]);
}

module.exports = {
    createUser,
    getUserById,
};

