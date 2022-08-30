import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import ProfilePicture from "./profilePicture";
import FriendshipButton from "./friendshipButton";

export default function OtherProfile() {
    const { user_id } = useParams();
    const [user, setUser] = useState({});
    const history = useHistory();

    useEffect(() => {
        fetch(`/api/users/${user_id}`)
            .then((response) => response.json())
            .then(
                (data) => {
                    if(!data){
                        history.replace("/");
                        return;
                    }
                    setUser(data);
                },
                [user_id]
            );
        // fetch the user info with the given user_id
        // update the user accordingly
        // if the user is not found (or is the logged user)
        // redirect to the homepage
        // see instructions above about how to use the history.replace method
    }, [user_id]);

    return (
        <div className="other-profile">
            <div>
                <ProfilePicture
                    profile_picture_url={user.profile_picture_url}
                />
                <p>{user.first_name} {user.last_name}</p>
                <p>{user.bio}</p>
                <FriendshipButton  otherUserId={user_id}/>
            </div>
        </div>
    );
}
