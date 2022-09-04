import { BrowserRouter, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import Login from "./login";


export default function Welcome() {
    return (
        <div className="welcome">
            <div id="heading">
                <h1>Welcome!</h1>
            </div>
            <div id="image">{<img src="/logo.png" />}</div>
            <BrowserRouter>
                <Route exact path="/">
                    <div>
                        <RegisterForm />
                    </div>
                </Route>

                <Route path="/login">
                    <div>
                        <Login />
                    </div>
                </Route>
            </BrowserRouter>
        </div>
    );
}
