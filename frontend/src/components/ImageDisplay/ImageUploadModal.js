import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { uploadImages,fetchImages } from "../../store/images";

function ImageUploadModal({ userId }) {
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (images.length === 0) {
      closeModal();
      return;
    }
    setErrors([]);
    const res = await dispatch(uploadImages(images, userId));
    if (res.ok)
    {
    closeModal();
    dispatch(fetchImages(userId));
    }
    else {
      const data = await res.json();
      if (data?.errors) setErrors(data.errors);
    }
  };

  const updateFiles = e => {
    const files = e.target.files;
    setImages(files);
  };

  return (
    <>
      <h1>Upload Images</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
        <label>
          Images to Upload
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            multiple
            onChange={updateFiles} />
        </label>
        <button type="submit">Upload!</button>
      </form>
    </>
  );
}

export default ImageUploadModal;
