import { BrowserRouter, Route } from "react-router-dom";
import RegisterForm from "./RegisterForm";
import Login from "./login";


export default function Welcome() {
    return (
        
        <div className="welcome" id="welcome">
            <h1>Welcome!</h1>
            {/* <img src="/logo.png" /> */}
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
