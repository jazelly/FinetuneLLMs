import React, { useState, useEffect, memo } from 'react';
import { X } from '@phosphor-icons/react';
import { isMobile } from 'react-device-detect';
import useUser from '../../../hooks/useUser';
import DocumentSettings from './Documents';

const noop = () => {};
const UploadDatasets = ({ hideModal = noop }) => {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useState('documents');

  if (isMobile) {
    return (
      <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
        <div className="backdrop h-full w-full absolute top-0 z-10" />
        <div className={`absolute max-h-full transition duration-300 z-20`}>
          <div className="relative max-w-lg mx-auto bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
            <div className="p-6">
              <h1 className="text-white text-lg font-semibold">
                Operating datasets
              </h1>
              <p className="text-white mt-4">
                Editing these settings are only available on a desktop device.
                Please access this page on your desktop to continue.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={hideModal}
                  type="button"
                  className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div
        className="backdrop h-full w-full absolute top-0 z-10"
        onClick={hideModal}
      />
      <div className="absolute max-h-full w-fit transition duration-300 z-20 md:overflow-y-auto py-10">
        <div className="relative bg-main-gradient rounded-[12px] shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-2 rounded-t border-gray-500/50 relative">
            <button
              onClick={hideModal}
              type="button"
              className="z-50 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-main-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>

          {user?.role !== 'default' && (
            <ModalTabSwitcher
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          )}

          <DocumentSettings />
        </div>
      </div>
    </div>
  );
};

export default UploadDatasets;

const ModalTabSwitcher = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className="w-full flex justify-center z-10 relative">
      <div className="gap-x-2 flex justify-center -mt-[68px] mb-10 bg-main-button p-1 rounded-xl shadow border-2 border-slate-300/10 w-fit">
        <button
          onClick={() => setSelectedTab('documents')}
          className={`px-4 py-2 rounded-[8px] font-semibold text-white hover:bg-switch-selected hover:bg-opacity-60 ${
            selectedTab === 'documents'
              ? 'bg-switch-selected shadow-md font-bold'
              : 'bg-main-button text-white/20 font-medium hover:text-white'
          }`}
        >
          Documents
        </button>
      </div>
    </div>
  );
};

export function useUploadDatasetsModal() {
  const [showing, setShowing] = useState(false);

  const showModal = () => {
    setShowing(true);
  };

  const hideModal = () => {
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
