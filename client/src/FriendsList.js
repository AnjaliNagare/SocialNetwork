import { Link } from "react-router-dom";

export default function FriendList({ friendships, onClick }) {
    return (
        <ul>
            {friendships.map((f) => (
                <li key={f.user_id}>
                    <a href={"/users/" + f.user_id}>
                        <img src={f.profile_picture_url}></img>
                    </a>
                    <div className="content">
                        <Link to={`/users/${f.user_id}`}>
                            {f.first_name} {f.last_name}
                        </Link>
                        <button onClick={() => onClick(f)}>
                            {f.accepted
                                ? "Unfriend"
                                : "Accept friend request"}
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
