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
            <form onSubmit={onSubmit}>
                <input
                    name="file"
                    type="file"
                    accept="image/*"
                    required
            
                ></input>
                <button className="btn"> Submit </button>
                <button onClick={onCloseModalClick} className="btn">
                    Close
                </button>
            </form>
        </div>
    );
}
