import { Link } from "react-router-dom";

export default function FriendList({ friendships, onClick }) {
    return (
        <div className="incomingRequest">
            {friendships.map((f) => (
                <div key={f.user_id}>
                    <div>
                        <Link to={`/users/${f.user_id}`} className="textName">
                            {f.first_name} {f.last_name}
                        </Link>
                    </div>
                    <a href={"/users/" + f.user_id}>
                        <img src={f.profile_picture_url}></img>
                    </a>
                    <div className="friendbtn">
                        <button onClick={() => onClick(f)}>
                            {f.accepted ? "Unfriend" : "Accept friend request"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
