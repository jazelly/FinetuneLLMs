import UploadFile from './UploadFile';
import FullScreenLoader from '@/components/reusable/Loaders.component';
import { useEffect, useState } from 'react';
import DatasetRow from '../DatasetRow.component';
import { Plus, Trash } from '@phosphor-icons/react';
import Document from '@/models/document';
import React from 'react';

function Directory({
  files,
  setFiles,
  loading,
  setLoading,
  fetchDatasets,
  selectedItems,
  setSelectedItems,
  setLoadingMessage,
  loadingMessage,
}) {
  const toggleSelection = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = { ...prevSelectedItems };
      if (item.type === 'folder') {
        // select all files in the folder
        if (newSelectedItems[item.name]) {
          delete newSelectedItems[item.name];
          item.items.forEach((file) => delete newSelectedItems[file.id]);
        } else {
          newSelectedItems[item.name] = true;
          item.items.forEach((file) => (newSelectedItems[file.id] = true));
        }
      } else {
        // single file selections
        if (newSelectedItems[item.id]) {
          delete newSelectedItems[item.id];
        } else {
          newSelectedItems[item.id] = true;
        }
      }

      return newSelectedItems;
    });
  };

  // check if item is selected based on selectedItems state
  const isSelected = (id, item?) => {
    if (item && item.type === 'folder') {
      if (!selectedItems[item.name]) {
        return false;
      }
      return item.items.every((file) => selectedItems[file.id]);
    }

    return !!selectedItems[id];
  };

  return (
    <div className="px-8 pb-8">
      <div className="flex flex-col gap-y-6">
        <div className="flex items-center justify-between w-[560px] px-5 relative">
          <h3 className="text-white text-base font-bold">Available Datasets</h3>
        </div>

        <div className="relative w-[560px] h-[310px] bg-zinc-900 rounded-2xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 z-10 rounded-t-2xl text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 shadow-lg bg-zinc-900">
            <p className="col-span-6">Name</p>
            <p className="col-span-3">Date</p>
            <p className="col-span-2">Type</p>
          </div>

          <div className="overflow-y-auto h-full pt-8">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
                <FullScreenLoader />
                <p className="text-white/80 text-sm font-semibold animate-pulse text-center w-1/3">
                  {loadingMessage}
                </p>
              </div>
            ) : files ? (
              files.map((file, index) => (
                <DatasetRow
                  key={index}
                  file={file}
                  selected={isSelected(file.name)}
                  toggleSelection={toggleSelection}
                />
              ))
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Dataset
                </p>
              </div>
            )}
          </div>
        </div>
        <UploadFile
          fetchDatasets={fetchDatasets}
          setLoading={setLoading}
          setLoadingMessage={setLoadingMessage}
        />
      </div>
    </div>
  );
}

export default Directory;
