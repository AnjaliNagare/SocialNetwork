import { useState, useEffect } from "react";

export default function FriendshipButton({ otherUserId }) {
    const [friendButtontext, changeFriendButtonText] = useState("");
    
    useEffect(() => {
        fetch("/api/friendship-status/" + otherUserId).then((response) =>
            response.json().then((data) => {
                changeFriendButtonText(data);
            })
        );
    }, [otherUserId]);

    function onFriendshipButtonClick(event) {
        event.preventDefault();
        fetch("/api/friendship-action", {
            method: "POST",
            body: JSON.stringify({
                friendButtontext: friendButtontext,
                otherUserId: otherUserId,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                changeFriendButtonText(data);
            });
    }
    return (
        <button onClick={onFriendshipButtonClick} >{friendButtontext}</button>
    );
}
