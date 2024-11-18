import { api } from "../services/api";

export default function FileTransfer({ domain, updateData }) {
  async function handleImport(event) {
    const file = event.target.files[0];
    const data = await file.text();
    const newData = await api(`${domain}/import`, "POST", { data });
    if (newData) {
      updateData(newData);
    }
    event.target.value = "";
  }

  async function handleExport() {
    const csv = await api(`${domain}/export`);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${domain}.csv`;
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col space-y-2 max-w-xs">
      <h3>Import/Export</h3>
      <input
        type="file"
        accept=".csv"
        onChange={async (event) => handleImport(event)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      />
      <button
        onClick={async () => await handleExport()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Export
      </button>
    </div>
  );
}
