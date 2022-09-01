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

const { Bucket, s3Upload } = require("./s3");
const { uploader } = require("./uploader");

const {
    createUser,
    getUserById,
    login,
    updateUserProfilePicture,
    editBio,
    searchUsers,
    getRecentUsers,
    makeFriendRequest,
    getFriendRequestStatus,
    acceptFriendRequest,
    deleteFriendship,
    getFriendships,
} = require("./db");

app.get("/api/users/me", (request, response) => {
    if (!request.session.user_id) {
        response.json(null);
        return;
    }
    getUserById(request.session.user_id).then((result) => {
        console.log(result);
        response.json(result);
    });
});

app.post("/api/users", (request, response) => {
    createUser(request.body)
        .then((newUser) => {
            console.log(newUser);
            request.session.user_id = newUser.id;
            response.json(newUser);
        })
        .catch((error) => {
            console.log("POST /api/users", error);
            if (error.constraint === "user_email_key") {
                response.status(400).json({ error: "E-mail already in use" });
                return;
            }
            response.status(500).json({ error: "Something went wrong" });
        });
});

app.post("/api/login", (request, response) => {
    console.log("post /login", request.body);

    login(request.body)
        .then((foundUser) => {
            if (!foundUser) {
                response.status(401).json({ error: "wrong credentials" });
                return;
            }
            request.session.user_id = foundUser.id;
            response.json("foundUser");
        })
        .catch((error) => {
            console.log("post/api/login", error);
            response.status(500).json({
                error: "Error logging user",
            });
        });
});

app.post("/logout", (request, response) => {
    request.session = null;
    response.json({ message: "User Logout" });
});

app.post(
    "/api/users/profile",
    uploader.single("file"),
    s3Upload,
    (request, response) => {
        const url = `https://s3.amazonaws.com/${Bucket}/${request.file.filename}`;
        console.log("POST /upload", url);
        updateUserProfilePicture({
            user_id: request.session.user_id,
            profile_picture_url: url,
        })
            .then((user) => {
                response.json(user);
            })
            .catch((error) => {
                console.log("post/upload", error);
                response
                    .status(500)
                    .json({ error: "error uploading profile picture" });
            });
    }
);

app.post("/api/bio", (request, response) => {
    const user_id = request.session.user_id;
    editBio(request.body.bio, user_id)
        .then((userBio) => {
            response.json(userBio);
        })
        .catch((error) => {
            console.log("post/editBio", error);
            response.statusCode(500).json({ message: "error editing bio" });
        });
});

app.get("/api/users/recent", async (request, response) => {
    try {
        console.log("query", request.query);
        const recentUsers = await getRecentUsers(request.query);
        response.json(
            recentUsers.filter((user) => user.id !== request.session.user_id)
        );
    } catch (error) {
        console.log(error);
    }
});

app.get("/api/users/search", async (request, response) => {
    const searchResults = await searchUsers(request.query);
    response.json(
        searchResults.filter((user) => user.id !== request.session.user_id)
    );
});

app.get("/api/users/:user_id", async (request, response) => {
    if (request.params.user_id == request.session.user_id) {
        response.json({ error: "This is the logged user" });
        return;
    }
    const otherUser = await getUserById(request.params.user_id);
    response.json(otherUser);
});

app.get("/api/friendship-status/:id", (request, response) => {
    getFriendRequestStatus({
        otherUserId: request.params.id,
        userId: request.session.user_id,
    }).then((friendship) => {
        console.log("friendship", friendship);
        if(!friendship){
            response.json("Add Friend");
            return;
        }
        if (
            friendship.sender_id === request.session.user_id
        ) {
            response.json("cancel friend request");
            return;
        }
        if(friendship.receiver_id === request.session.user_id){
            response.json("Accept friend request");
            return;
        }
        if(friendship.accepted){
            response.json("Unfriend");
        }
        
    });
});

app.post("/api/friendship-action", (request, response) => {
    const senderId = request.session.user_id;
    const { friendButtontext, otherUserId } = request.body;
    if (
        friendButtontext == "cancel friend request" ||
        friendButtontext == "unfriend"
    ) {
        deleteFriendship(senderId, otherUserId).then(() =>
            response.json("Add Friend")
        );
    } 
    if (friendButtontext == "Add Friend") {
        console.log(senderId, otherUserId);
        makeFriendRequest(senderId, otherUserId).then(() =>
            response.json("cancel friend request")
        );
    }
    if (friendButtontext == "Accept friend request") {
        console.log(senderId, otherUserId);
        acceptFriendRequest(senderId, otherUserId).then(() =>
            response.json("Unfriend")
        );
    }
});

app.get("/api/friendships", async (request, response) =>{
    const friendList = await getFriendships(request.session.user_id);
    response.json(friendList);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
