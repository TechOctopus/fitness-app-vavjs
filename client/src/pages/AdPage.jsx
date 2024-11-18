import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function AdPage() {
  const [ad, setAd] = useState({});
  const [adDialog, setAdDialog] = useState(true);

  useEffect(() => {
    (async () => {
      await api("ad").then((ad) => setAd(ad));
    })();
  }, []);

  async function handleClick() {
    await api("ad/click", "POST");
    window.open(ad.target_url, "_blank");
    setAdDialog(!adDialog);
  }

  setInterval(() => {
    setAdDialog(true);
  }, 60000);

  return (
    <div>
      <h1>Ad Page</h1>
      <dialog open={adDialog}>
        <div className="max-w-sm p-4 shadow-md rounded flex flex-col gap-4">
          <p>Ad</p>
          <img
            src={ad.image_url}
            alt="ad"
            onClick={handleClick}
            className="h-20"
          />
          <button onClick={() => setAdDialog(!adDialog)}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
