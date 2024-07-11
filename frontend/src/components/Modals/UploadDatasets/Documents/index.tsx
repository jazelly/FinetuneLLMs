import { useEffect, useState } from 'react';

import Directory from './Directory.component';
import Document from '@/models/document';
import { DatasetBase } from '@/types/dashboard.type';
import React from 'react';

export default function DocumentSettings() {
  const [availableDocs, setAvailableDocs] = useState<DatasetBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  async function fetchDatasets() {
    setLoading(true);
    try {
      const localDatasetsResponse = await Document.readLocalDatasets();
      const remoteDatasetsResponse = await Document.readRemoteDatasets();
      const remoteDatasets = remoteDatasetsResponse;

      // Documents that are not in the workspace
      const availableDatasets = [...localDatasetsResponse, ...remoteDatasets];

      // Documents that are already in the workspace
      setAvailableDocs(availableDatasets);
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="flex upload-modal -mt-6 z-10 relative">
      <Directory
        files={availableDocs}
        setFiles={setAvailableDocs}
        loading={loading}
        loadingMessage={loadingMessage}
        setLoading={setLoading}
        fetchDatasets={fetchDatasets}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setLoadingMessage={setLoadingMessage}
      />
      {/* TODO: file preview */}
    </div>
  );
}
