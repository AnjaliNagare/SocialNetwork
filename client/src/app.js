import { Component } from "react";
import ProfilePicture from "./profilePicture";
import PictureModal from "./pictureModal";
import Profile from "./profile";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            showModal: false,
        };

        this.onImageclick = this.onImageclick.bind(this);
        this.onCloseModalClick = this.onCloseModalClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.updateBio = this.updateBio.bind(this);
    }
    onImageclick() {
        this.setState({
            showModal: true,
        });
    }

    onCloseModalClick() {
        console.log("click");
        this.setState({
            showModal: false,
        });
    }

    onUpload(profile_picture_url) {
        this.setState({
            user: {
                ...this.state.user,
                profile_picture_url: profile_picture_url,
            },
        });
    }

    updateBio(userBio) {
        this.setState({
            user: {
                ...this.state.user,
                bio: userBio,
            },
        });
    }

    async componentDidMount() {
        const response = await fetch("/api/users/me");
        const data = await response.json();
        this.setState({
            user: { ...data },
        });
    }

    render() {
        return (
            <BrowserRouter>
                <section className="app">
                    <header>
                        <Link to="/">Home</Link>
                    </header>
                    <section>
                        <Route path="/" exact>
                            <div>
                                <ProfilePicture
                                    onImageclick={this.onImageclick}
                                    profile_picture_url={
                                        this.state.user.profile_picture_url
                                    }
                                />
                            </div>
                            {this.state.showModal && (
                                <PictureModal
                                    onUpload={this.onUpload}
                                    onCloseModalClick={this.onCloseModalClick}
                                />
                            )}
                            <Profile
                                updateBio={this.updateBio}
                                user={this.state.user}
                            />
                        </Route>
                    </section>
                </section>
            </BrowserRouter>
        );
    }
}
