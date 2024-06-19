import { CloudArrowUp } from '@phosphor-icons/react';
import { useState } from 'react';
import showToast from '../../../../../utils/toast';
import { useDropzone } from 'react-dropzone';
import { v4 } from 'uuid';
import FileUploadProgress from './FileUploadProgress.component';
import debounce from 'lodash.debounce';
import { isHFDatasetLinkValid } from '../../../../../utils/misc';
import Document from '@/models/document';
import React from 'react';

export default function UploadFile({
  fetchDatasets,
  setLoading,
  setLoadingMessage,
}) {
  const [files, setFiles] = useState<any[]>([]);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [hfLinkError, setHFLinkError] = useState('');

  const onLinkInputChange = () => {
    if (!!hfLinkError) setHFLinkError('');
  };

  const handleScrapeHFLink = async (e) => {
    e.preventDefault();
    const formEl = e.target;
    const form = new FormData(formEl);
    const link = form.get('link');

    if (!isHFDatasetLinkValid(link)) {
      setHFLinkError('Must be a huggingface dataset link');
      return;
    }

    setLoading(true);
    setLoadingMessage(
      'Fetching dataset info \n Note this does not necessarily download the dataset...'
    );
    setFetchingUrl(true);

    console.log('link', link);
    const response = await Document.saveDatasetFromHF(link);

    if (response.message !== 'dataset saved') {
      showToast(`Error uploading link: ${response.error}`, 'error');
    } else {
      fetchDatasets();
      const configSplits = response.configSplit;
      console.log('configSplit', configSplits);
      let toastMessage =
        'Found and saved the following configuration and split: \n';
      for (const configSplit of configSplits) {
        const configSplitJson = JSON.parse(configSplit);
        toastMessage += `${configSplitJson.config}-${configSplitJson.split}; \n`;
      }

      showToast(toastMessage, 'success');
      formEl.reset();
    }

    setLoading(false);
    setFetchingUrl(false);
  };

  // Don't spam fetchDatasets, wait 1s between calls at least.
  const handleUploadSuccess = debounce(() => fetchDatasets(), 1000);
  const handleUploadError = (_msg) => null; // stubbed.

  const onDrop = async (acceptedFiles, rejections) => {
    const newAccepted = acceptedFiles.map((file) => {
      return {
        uid: v4(),
        file,
      };
    });
    const newRejected = rejections.map((file) => {
      return {
        uid: v4(),
        file: file.file,
        rejected: true,
        reason: file.errors[0].code,
      };
    });
    setFiles([...newAccepted, ...newRejected]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  console.log('files', files);

  return (
    <div>
      <div
        className="w-[560px] border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3 cursor-pointer hover:bg-zinc-900/90"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <CloudArrowUp className="w-8 h-8 text-white/80" />
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              Click to upload or drag and drop
            </div>
            <div className="text-white text-opacity-60 text-xs font-medium py-1">
              currently only supports txt, csv and json files
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 overflow-auto max-h-[180px] p-1 overflow-y-scroll no-scroll">
            {files.map((file: any) => (
              <FileUploadProgress
                key={file.uid}
                file={file.file}
                uuid={file.uid}
                setFiles={setFiles}
                rejected={file?.rejected}
                reason={file?.reason}
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
                setLoading={setLoading}
                setLoadingMessage={setLoadingMessage}
              />
            ))}
          </div>
        )}
      </div>
      <div className="text-center text-white text-opacity-50 text-xs font-medium w-[560px] py-2">
        or provide a huggingface dataset link
      </div>
      <div>
        <form onSubmit={handleScrapeHFLink} className="flex gap-x-2">
          <input
            disabled={fetchingUrl}
            name="link"
            onChange={onLinkInputChange}
            className={`disabled:bg-zinc-600 disabled:text-slate-300 bg-zinc-900 text-white placeholder:text-white/20 
            text-sm rounded-lg ${
              !!hfLinkError && 'border ring-red-500 border-red-500'
            } focus:ring-blue-500 focus:border-blue-500 block w-3/4 p-2.5`}
            placeholder={'https://huggingface.co/datasets/xxx/xxx'}
            autoComplete="off"
          />
          <button
            disabled={fetchingUrl}
            type="submit"
            className={`disabled:bg-white/20 disabled:text-slate-300 disabled:border-slate-400 disabled:cursor-wait
             bg bg-transparent hover:bg-slate-200 hover:text-slate-800 w-auto border border-white text-sm text-white p-2.5 rounded-lg`}
          >
            {fetchingUrl ? 'Fetching...' : 'Fetch website'}
          </button>
        </form>
        {!!hfLinkError && (
          <div className="block text-sm font-medium text-red-600 mt-1 ml-1">
            {hfLinkError}
          </div>
        )}
      </div>
      <div className="mt-6 text-center text-white text-opacity-80 text-xs font-medium w-[560px]">
        These files will be uploaded to FinetuneLLMs storage where you deployed
        server.
      </div>
    </div>
  );
}
