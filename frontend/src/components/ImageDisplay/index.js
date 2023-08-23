import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchImages,deleteImage } from "../../store/images";
import OpenModalButton from "../OpenModalButton";
import ImageUploadModal from "./ImageUploadModal";
import "./ImageDisplay.css";

function ImageDisplay() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const imageUrls = useSelector(state => state.images);

  useEffect(() => {
    if (!sessionUser) return;
    dispatch(fetchImages(sessionUser.id))
  }, [dispatch, sessionUser]);

  if (!sessionUser) return null;

const handleDelete = async (imageId) => {
  const result = await dispatch(deleteImage(imageId));
  if (result) {
    dispatch(fetchImages(sessionUser.id));
  }
};

    const display = imageUrls?.map(imageData => {
      // console.log(imageData)
      return (
          <div className="image-container" key={imageData.id}>
              <img className="image" src={imageData.url} alt="" />
              <button onClick={() => handleDelete(imageData.id)}>Delete</button>
          </div>
      );
    });

  return (
    <div className="image-display">
      <h1> {`${sessionUser.username}'s Images`} </h1>
      <OpenModalButton
        buttonText="Upload Images"
        modalComponent={<ImageUploadModal userId={sessionUser.id} />}
      />
      <div className="images">
        {display}
      </div>
    </div>
  );
}
export default ImageDisplay;
