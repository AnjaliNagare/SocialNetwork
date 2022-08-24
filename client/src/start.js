import ReactDOM from "react-dom";
import Welcome from "./welcome";
import App from "./app";

fetch("/api/users/me")
    .then((response) => response.json())
    .then((user) => {
        if (!user) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(<App />, document.querySelector("main"));
        }
    });

// import ReactDOM from "react-dom";
// import Welcome from "./Welcome";

// // ReactDOM.render(<Welcome />, document.querySelector("main"));

// fetch("/api/users/me")
//     .then((response) => response.json())
//     .then((user) => {
//         if (!user) {
//             ReactDOM.render(<Welcome />, document.querySelector("main"));
//         } else {
//             ReactDOM.render(<Welcome />, document.querySelector("main"));
//         }
//     });

// function HelloWorld() {
//     return <div>Hello, World!</div>;
// }
