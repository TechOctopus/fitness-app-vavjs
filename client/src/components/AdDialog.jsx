import { useState } from "react";

export const AdDialog = ({ ad, handleUpdateAd }) => {
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(ad.image_url);
  const [link, setLink] = useState(ad.target_url);

  async function updateAdForm(event) {
    event.preventDefault();
    event.target.reset();
    const updatedAd = { ...ad, image_url: image, target_url: link };
    await handleUpdateAd(updatedAd);
    setOpen(!open);
  }

  function closeDialog() {
    setImage(ad.image_url);
    setLink(ad.target_url);
    setOpen(!open);
  }

  return (
    <>
      <button onClick={() => setOpen(!open)}>Update</button>
      <dialog open={open}>
        <div className="p-4 shadow-md rounded flex flex-col gap-4">
          <p>Update Ad</p>
          <form onSubmit={(event) => updateAdForm(event)}>
            <label htmlFor="image">Image</label>
            <textarea
              id="image"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
            <label htmlFor="link">Link</label>
            <textarea
              id="link"
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
            <button type="submit" className="btn-success">
              Save
            </button>
          </form>
          <button onClick={() => closeDialog()}>Cancel</button>
        </div>
      </dialog>
    </>
  );
};
