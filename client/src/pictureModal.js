export default function PictureModal({ onUpload, onCloseModalClick }) {
    function onSubmit(event) {
        event.preventDefault();
        fetch("/api/users/profile", {
            method: "POST",
            body: new FormData(event.target),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert("Error uploading avatar!");
                    return;
                }

                onUpload(data.profile_picture_url);
                // call onUpload with the right information from data
            });
    }
    console.log("closeBtnClick", onCloseModalClick);

    return (
        <div className="modal">
            <button onClick={onCloseModalClick}>X</button>
            <form onSubmit={onSubmit}>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    required
                ></input>
                <button> Submit </button>
            </form>
        </div>
    );
}
