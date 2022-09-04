import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioChange: false,
            draftBio: "",
            showTextArea: false,
        };

        this.onClick = this.onClick.bind(this);
        this.handleBioChange = this.handleBioChange.bind(this);
        this.editBio = this.editBio.bind(this);
        this.cancelEdit = this.cancelEdit.bind(this);
    }

    onClick() {
        this.setState({
            showTextArea: true,
        });
    }

    cancelEdit(event) {
        this.setState({
            showTextArea: false,
            draftBio: event.target.value,
        });
    }

    handleBioChange(event) {
        this.setState({ 
            bioChange: true ,
            draftBio: event.target.value 
        });
    }

    editBio(event) {
        event.preventDefault();

        fetch("/api/bio", {
            method: "POST",
            body: JSON.stringify({
                bio: this.state.draftBio,
            }),
            headers: { "Content-Type": "application/json" },
        })
            .then((response) => response.json())
            .then((data) => {
                this.props.updateBio(data.bio);
            })
            .catch((error) => console.log("Update bio", error));

        this.setState({
            showTextArea: false,
        });
    }

    render() {
        return (
            <div>
                <p>{this.props.user.bio}</p>
                <button onClick={this.onClick} className="btn">
                    Edit Bio
                </button>
                {this.state.showTextArea && (
                    <form>
                        <textarea id="textarea"
                            onInput={this.handleBioChange}
                            defaultValue={this.props.user.bio}
                        ></textarea>
                        <div>
                            <button onClick={this.editBio} className="btn">
                                Save Bio
                            </button>
                            <button onClick={this.cancelEdit} className="btn">
                                cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

    

