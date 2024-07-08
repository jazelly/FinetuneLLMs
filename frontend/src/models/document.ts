import { DatasetLocal, DatasetRemote } from '@/types/dashboard.type';
import { API_BASE } from '@/utils/constants';
import { baseHeaders } from '@/utils/request';

const Document = {
  uploadOneDatasetByChunk: async (datasetChunk) => {
    const response = await fetch(`${API_BASE}/document/upload-by-chunk`, {
      method: 'POST',
      body: datasetChunk,
    });

    return response;
  },

  saveDatasetFromHF: async (link) => {
    const response = await fetch(`${API_BASE}/document/save-from-hf`, {
      method: 'POST',
      body: JSON.stringify({ link }),
    });

    return response.json();
  },

  readLocalDatasets: async (): Promise<readonly DatasetLocal[]> => {
    try {
      const response = await fetch(`${API_BASE}/document/local/all`, {
        method: 'GET',
      });
      return response.json();
    } catch (err: any) {}
    return [];
  },
  readRemoteDatasets: async (): Promise<readonly DatasetRemote[]> => {
    try {
      const response = await fetch(`${API_BASE}/document/remote/all`, {
        method: 'GET',
      });

      return response.json();
    } catch (err: any) {}

    return [];
  },
};

export default Document;
