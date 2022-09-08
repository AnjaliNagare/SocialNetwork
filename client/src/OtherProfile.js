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
        
    }, [user_id]);

    return (
        <div className="otherProfile">
            <div className="profile">
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
