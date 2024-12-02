import { useState, useEffect } from "react";
import { api } from "../services/api";

export default function AdPage() {
  const [ad, setAd] = useState(null);
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
        <div className="p-4 shadow-md rounded flex flex-col gap-4">
          <p>Ad</p>
          {!ad ? (
            <p>No ad available</p>
          ) : (
            <>
              <img src={ad.image_url} alt="ad" className="h-40 max-w-40" />
              <a
                href={ad.target_url}
                target="_blank"
                onClick={handleClick}
                className="text-blue-500 hover:text-blue-700 underline"
              >
                Go to ad
              </a>
            </>
          )}
          <button onClick={() => setAdDialog(!adDialog)}>Close</button>
        </div>
      </dialog>
    </div>
  );
}
