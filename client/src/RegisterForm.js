import { Component } from "react";

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
            headers: {},
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
            <form onSubmit={this.onSubmit}>
                <input
                    name="first_name"
                    type="first_name"
                    required
                    placeholder="First Name"
                />
                <input
                    name="last_name"
                    type="last_name"
                    required
                    placeholder="last Name"
                />
                <input name="email" type="email" required placeholder="Email" />
                <input
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                />
                <button>Register</button>
                {this.state.error && <p>{this.state.error}</p>}
            </form>
        );
    }
}

