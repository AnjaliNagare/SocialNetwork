import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import ProfilePicture from "./profilePicture";

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
                }
            );
        // fetch the user info with the given user_id
        // update the user accordingly
        // if the user is not found (or is the logged user)
        // redirect to the homepage
        // see instructions above about how to use the history.replace method
    }, [user_id]);

    return (<div className="other-profile">
        <div>
            <ProfilePicture
                profile_picture_url={user.profile_picture_url}
            />
            <p key={user.id}>{user.first_name} {user.last_name}</p>
            <p>{user.bio}</p>
        </div>
    </div>
    );
}
