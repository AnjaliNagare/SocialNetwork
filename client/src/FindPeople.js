import { useState, useEffect } from "react";
import ProfilePicture from "./profilePicture";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    useEffect(() => {
        fetch("/api/users/recent?limit=3")
            .then((response)=> response.json())
            .then((data) => {
                setRecentUsers(data);
            });
    }, []);

    // this other useEffect is needed to react to the search term change:
    useEffect(() => {
        if (searchTerm.length < 1) {
            return;
        }
        fetch("api/users/search?q=" + searchTerm)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }, [searchTerm]);

    function onChange(event){
        setSearchTerm(event.target.value);
    }

    function UserList({ users }) {
        return !users.length ? (
            "No Results"
        ) : (
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>
                            <ProfilePicture {...user} />
                            {user.first_name} {user.last_name}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="find-people">
            <h2>Find People</h2>
            <section className="recent-users">
                <h3>Recent Users</h3>
                <UserList users={recentUsers}></UserList>
            </section>
            <section className="search-results">
                <h3>Looking for someone in particular?</h3>
                <p>
                    <input
                        defaultValue={searchTerm}
                        onChange={onChange}
                        placeholder="Search for users..."
                    />
                </p>
                
                <UserList users={searchResults} />
             
            </section>
        </section>
    );
}

