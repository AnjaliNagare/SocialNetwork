import { Component } from "react";
import { Link } from "react-router-dom";

import "../style.css";

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value,
        };

        console.log(formData);
        fetch("/api/users", {
            method: "post",
            body: JSON.stringify(formData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log("/post", data.error);
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div className="register">
                <form onSubmit={this.onSubmit}>
                    <div className="inputfield">
                        <input
                            name="first_name"
                            type="first_name"
                            required
                            placeholder="First Name"
                            size="32"
                        />
                    </div>
                    <div className="inputfield">
                        <input
                            name="last_name"
                            type="last_name"
                            required
                            placeholder="last Name"
                            size="32"
                        />
                    </div>
                    <div className="inputfield">
                        <input
                            name="email"
                            type="email"
                            required
                            placeholder="Email"
                            size="32"
                        />
                    </div>
                    <div className="inputfield">
                        <input
                            name="password"
                            type="password"
                            required
                            placeholder="Password"
                            size="32"
                        />
                    </div>
                    <div className="btn">
                        <button>Register</button>
                    </div>

                    {this.state.error && <p>{this.state.error}</p>}
                </form>
                <Link to="/login" className="links">
                    Click here to Log in!
                </Link>
            </div>
        );
    }
}

