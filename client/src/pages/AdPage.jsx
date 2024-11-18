import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function AdPage() {
  const [ad, setAd] = useState({});
  const [adDialog, setAdDialog] = useState(true);

  useEffect(() => {
    (async () => {
      await api("ad").then((ad) => setAd(ad));
    })();

    const interval = setInterval(() => {
      setAdDialog(true);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  async function handleClick() {
    await api("ad/click", "POST");
    window.open(ad.target_url, "_blank");
    setAdDialog(!adDialog);
  }

  return (
    <div>
      <h1>Ad Page</h1>
      <p className="pt-4">
        At this page, you can view an ad every minute. If you click on the ad,
        you will be redirected to the ad's target URL.
      </p>
      <dialog open={adDialog}>
        <div className="max-w-sm p-4 shadow-md rounded flex flex-col gap-4">
          <p>Ad</p>
          <img src={ad.image_url} alt="ad" className="h-20" />
          <a
            href={ad.target_url}
            target="_blank"
            rel="noreferrer"
            onClick={handleClick}
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Go to ad
          </a>
          <button onClick={() => setAdDialog(!adDialog)}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
