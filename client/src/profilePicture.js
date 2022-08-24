export default function ProfilePicture({ profile_picture_url, onImageclick }) {
    return (
        <img onClick={onImageclick}
            className="profile-picture"
            src={profile_picture_url}
            alt="user_profile_picture"
        />
    );
}
