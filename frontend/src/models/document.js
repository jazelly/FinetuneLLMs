import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Document = {
  createFolder: async (name) => {
    return await fetch(`${API_BASE}/document/create-folder`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  moveToFolder: async (files, folderName) => {
    const data = {
      files: files.map((file) => ({
        from: file.folderName ? `${file.folderName}/${file.name}` : file.name,
        to: `${folderName}/${file.name}`,
      })),
    };

    return await fetch(`${API_BASE}/document/move-files`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  uploadOneDatasetByChunk: async (datasetChunk) => {
    const response = await fetch(`${API_BASE}/document/upload-by-chunk`, {
      method: "POST",
      body: datasetChunk,
    });

    return response.json();
  },

  saveDatasetFromHF: async (link) => {
    const response = await fetch(`${API_BASE}/document/save-from-hf`, {
      method: "POST",
      body: JSON.stringify({ link }),
    });

    return response.json();
  },

  readRemoteDatasets: async () => {
    const response = await fetch(`${API_BASE}/document/remote/all`, {
      method: "GET",
    });

    return response.json();
  },
};

export default Document;
