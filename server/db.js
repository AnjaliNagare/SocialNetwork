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

async function getRecentUsers({ limit }) {
    const result = await db.query(
        `SELECT * FROM users
        ORDER BY id DESC
        LIMIT $1`,
        [limit]
    );
    return result.rows;
}

async function searchUsers({ q, limit=10 }) {
    const result = await db.query(
        `SELECT * FROM users
        WHERE first_name ILIKE $1
        OR last_name ILIKE $1
        ORDER BY first_name
        ASC LIMIT $2`,
        [q + "%", limit]
    );
    return result.rows;
}

function makeFriendRequest(senderId, otherUserId) {
    return db
        .query(
            `
    INSERT INTO friendships
    (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING sender_id, receiver_id, accepted`,
            [senderId, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function getFriendRequestStatus({otherUserId, userId}) {
    return db
        .query(
            `SELECT * FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR receiver_id=$2 AND sender_id=$1`,
            [otherUserId, userId]
        )
        .then((result) => result.rows[0]);
}

function acceptFriendRequest(senderId, otherUserId) {
    return db
        .query(
            `UPDATE friendships
    SET accepted = 'true'
    WHERE receiver_id=$1 AND sender_id=$2
    OR receiver_id=$2 AND sender_id=$1`,
            [senderId, otherUserId]
        )
        .then((result) => result.rows[0]);
}
 
function deleteFriendship(senderId, otherUserId) {
    return db
        .query(
            `DELETE FROM friendships
        WHERE receiver_id=$1 AND sender_id=$2
        OR receiver_id=$2 AND sender_id=$1`,
            [senderId, otherUserId]
        )
        .then((result) => result.rows[0]);
}

function getFriendships(user_id) {
    return db
        .query(
            `
    SELECT friendships.accepted,
friendships.sender_id,
friendships.receiver_id,
friendships.id AS friendship_id,
users.first_name, users.last_name, users.profile_picture_url
FROM friendships
JOIN users
ON (
    users.id = friendships.sender_id
    AND friendships.receiver_id = $1)
OR (
    users.id = friendships.receiver_id
    AND friendships.sender_id = $1
    AND accepted = true)`,
            [user_id]
        )
        .then((result) => result.rows);
}


module.exports = {
    createUser,
    getUserById,
    login,
    updateUserProfilePicture,
    editBio,
    getRecentUsers,
    searchUsers,
    makeFriendRequest,
    getFriendRequestStatus,
    acceptFriendRequest,
    deleteFriendship,
    getFriendships,
};

