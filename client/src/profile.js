import BioEditor from "./bioeditor";
// import ProfilePicture from "./profilePicture";


export default function Profile(props){
    return (
        <div className="profile">
            <h2>
                {props.user.first_name} {props.user.last_name}
            </h2>
            {/* <ProfilePicture
                profile_picture_url={props.user.profile_picture_url}
            /> */}
            <div>
                <BioEditor updateBio={props.updateBio} user={props.user} />
            </div>
        </div>
    );
}