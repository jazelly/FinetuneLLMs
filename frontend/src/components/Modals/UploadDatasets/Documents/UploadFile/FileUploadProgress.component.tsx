import React, { useState, useEffect, memo } from 'react';
import truncate from 'truncate';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { humanFileSize, milliToHms } from '@/utils/numbers';
import { PreLoader } from '@/components/reusable/Loaders.component';
import Document from '@/models/document';

const CHUNK_SIZE = 100000; // bytes

function FileUploadProgressComponent({
  uuid,
  file,
  setFiles,
  rejected = false,
  reason = null,
  onUploadSuccess,
  onUploadError,
  setLoading,
  setLoadingMessage,
}) {
  const [timerMs, setTimerMs] = useState(10);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  const fadeOut = (cb) => {
    setIsFadingOut(true);
    cb?.();
  };

  const beginFadeOut = () => {
    setIsFadingOut(false);
    setFiles((prev) => {
      return prev.filter((item) => item.uid !== uuid);
    });
  };

  useEffect(() => {
    async function uploadFile() {
      setLoading(true);
      setLoadingMessage('Uploading file...');
      const start = Number(new Date());

      const timer = setInterval(() => {
        setTimerMs(Number(new Date()) - start);
      }, 100);

      console.log('file', file);

      const fileSize = file.size;
      const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);

      let response;
      for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
        const start = chunkIndex * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, fileSize);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk, file.name);
        formData.append('chunkIndex', `${chunkIndex}`);
        formData.append('totalChunks', `${totalChunks}`);

        console.log('Uploading chunk: ', chunkIndex);
        response = await Document.uploadOneDatasetByChunk(formData);
        console.log(`chunk ${chunkIndex}`, response);
        if (response.status !== 200) {
          break;
        }
      }

      if (response.status !== 200) {
        setStatus('failed');
        onUploadError(response.error);
        setError(response.error);
      } else {
        setStatus('complete');
        onUploadSuccess();
      }

      setLoading(false);
      setLoadingMessage('');
      clearInterval(timer);

      // Begin fadeout timer to clear uploader queue.
      setTimeout(() => {
        fadeOut(() => setTimeout(() => beginFadeOut(), 300));
      }, 5000);
    }
    !!file && !rejected && uploadFile();
  }, []);

  if (rejected) {
    return (
      <div
        className={`${
          isFadingOut ? 'file-upload-fadeout' : 'file-upload'
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{reason}</p>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div
        className={`${
          isFadingOut ? 'file-upload-fadeout' : 'file-upload'
        } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40 overflow-y-auto`}
      >
        <div className="w-6 h-6 flex-shrink-0">
          <XCircle className="w-6 h-6 stroke-white bg-red-500 rounded-full p-1 w-full h-full" />
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs font-medium">
            {truncate(file.name, 30)}
          </p>
          <p className="text-red-400 text-xs font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isFadingOut ? 'file-upload-fadeout' : 'file-upload'
      } h-14 px-2 py-2 flex items-center gap-x-4 rounded-lg bg-white/5 border border-white/40`}
    >
      <div className="w-6 h-6 flex-shrink-0">
        {status !== 'complete' ? (
          <div className="flex items-center justify-center">
            <PreLoader size={6} />
          </div>
        ) : (
          <CheckCircle className="w-6 h-6 stroke-white bg-green-500 rounded-full p-1 w-full h-full" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-white text-xs font-medium">
          {truncate(file.name, 30)}
        </p>
        <p className="text-white/60 text-xs font-medium">
          {humanFileSize(file.size)} | {milliToHms(timerMs)}
        </p>
      </div>
    </div>
  );
}

export default FileUploadProgressComponent;
