import BioEditor from "./bioeditor";

export default function Profile(props){
    return (
        <div className="profile">
            <h2>
                {props.user.first_name} {props.user.last_name}
            </h2>
            <div>
                <BioEditor updateBio={props.updateBio} user={props.user} />
            </div>
        </div>
    );
}