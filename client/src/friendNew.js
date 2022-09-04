import { useState, useEffect } from "react";
import FriendList from "./FriendsList";

export default function Friends() {
    const [friendships, setFriendships] = useState([]);

    useEffect(() => {
        fetch("/api/friendships")
            .then((response) => response.json())
            .then((data) => {
                setFriendships(data);
            });
        // fetch the friendships from the server
        // update the friendship state
    }, []);

    function onClick(friendship) {
        friendship.preventDefault();
        fetch("api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                friendButtontext: friendship.accepted
                    ? "Unfriend"
                    : "Accept friend request",
                receiver_id : friendship.id,
            }),
            headers: { "Content-Type": "application/json" },
        });
        // if the friendship is accepted,
        // cancel it and update the friendships state
        // else
        // accept it and update the friendships state as well

        if(friendship.accepted) {
            const newFriendships = friendships.filter(
                (friendship) => friendship.id !== friendship.id);
            setFriendships(newFriendships);
            return;
        }

        console.log("onClick", friendship.friendship_id);

 
        const targetFriend_id = friendship.friendship_id;
        if (!friendship.accepted) {
            const newFriendships = friendships.map((f) => {
                if (f.friendship_id === targetFriend_id) {
                    f.accepted = true;
                }
                return f;
            });
            console.log({ newFriendships });
            setFriendships(newFriendships);
        }
    }

    // split the friendships in two groups
    const incoming = Object.values(friendships).filter(
        (f) => !f.accepted
    );
    const accepted = Object.values(friendships).filter((f) => f.accepted);
    // const incoming = friendships.filter((f) => !f.accepted);
    // const accepted = friendships.filter((f) => f.accepted);

    return (
        <section className="friends">
            <h2>Friends</h2>

            <section className="incomingfrndlist">
                <h3>Incoming requests</h3>
                <FriendList friendships={incoming} onClick={onClick} />
            </section>
            <section className="current-list">
                <h3>Current friends</h3>
                <FriendList friendships={accepted} onClick={onClick} />
            </section>
        </section>
    );
}
