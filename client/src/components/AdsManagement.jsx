import { useState, useEffect } from "react";
import { api } from "../services/api";
import { AdDialog } from "../components/AdDialog";

export default function AdsManagement() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    (async () => {
      await api("ads").then((ads) => setAds(ads));
    })();
  }, []);

  async function handleUpdateAd(ad) {
    const updatedAd = await api(`ad/${ad.id}`, "PUT", ad);
    setAds(ads.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad)));
  }

  return (
    <>
      <h2>Ads Management</h2>
      <table className="border pt-4">
        <thead>
          <tr>
            <th>Img</th>
            <th>Link</th>
            <th>Clicks Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={ad.id}>
              <td>
                <img
                  src={ad.image_url}
                  alt={ad.image_url}
                  className="w-full max-h-20 max-w-20"
                />
              </td>
              <td>{ad.target_url}</td>
              <td>{ad.click_count}</td>
              <td>
                <AdDialog ad={ad} handleUpdateAd={handleUpdateAd} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
