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
        <div className="max-w-sm p-4 shadow-md rounded flex flex-col gap-4">
          <p>Update Ad</p>
          <form
            onSubmit={(event) => updateAdForm(event)}
            className="flex flex-col gap-4"
          >
            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(event) => setImage(event.target.value)}
            />
            <label htmlFor="link">Link</label>
            <input
              id="link"
              type="text"
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
            <button type="submit" className="bg-blue-500 text-white rounded">
              Save
            </button>
          </form>
          <button
            onClick={() => closeDialog()}
            className="bg-red-500 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </dialog>
    </>
  );
};
