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
                `INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *`,
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

function login({ email, password }) {
    return getUserByEmail(email).then((foundUser) => {
        if (!foundUser) {
            console.log("email not found");
            return null;
        }
        console.log("email matches!");
        return bcrypt
            .compare(password, foundUser.password_hash)
            .then((match) => {
                if (!match) {
                    return null;
                }
                return foundUser;
            });
    });
}
function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => result.rows[0]);
}

async function updateUserProfilePicture({ user_id, profile_picture_url }) {
    const result = await db.query(
        `
    UPDATE users SET profile_picture_url = $1 WHERE id = $2 
    RETURNING profile_picture_url`,
        [profile_picture_url, user_id]
    );
    return  result.rows[0];
}

async function editBio(userBio, user_id) {
    const result =  await db.query(`UPDATE users SET bio = $1 WHERE id=$2 RETURNING bio`,
        [userBio, user_id]);
    return result.rows[0];
}

module.exports = {
    createUser,
    getUserById,
    login,
    updateUserProfilePicture,
    editBio,
};

