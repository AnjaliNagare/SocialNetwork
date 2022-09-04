import { Component } from "react";
import { Link } from "react-router-dom";

import "../style.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    onFormSubmit(event) {
        event.preventDefault();

        const loginData = {
            email: event.target.email.value,
            password: event.target.password.value,
        };

        console.log(loginData);
        fetch("/api/login", {
            method: "post",
            body: JSON.stringify(loginData),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    this.setState({ error: "wrong credentials" });
                    console.log("/post", data.error);
                    return;
                } else {
                    window.location.href = "/";
                }
            });
    }
    render() {
        return (
            <div className="login">
                <form onSubmit={this.onFormSubmit}>
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
                        <button>Login</button>
                    </div>
                    {this.state.error && <p>{this.state.error}</p>}
                </form>
                <Link to="/" className="links">
                    Click here to Register!
                </Link>
            </div>
        );
    }
}
