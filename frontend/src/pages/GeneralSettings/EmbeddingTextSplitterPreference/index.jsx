import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/SettingsSidebar';
import { isMobile } from 'react-device-detect';
import FullScreenLoader from '@/components/Loaders.component';
import CTAButton from '@/components/CTAButton';
import Admin from '@/models/admin';
import showToast from '@/utils/toast';
import { nFormatter, numberWithCommas } from '@/utils/numbers';

function isNullOrNaN(value) {
  if (value === null) return true;
  return isNaN(value);
}

export default function EmbeddingTextSplitterPreference() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (
      Number(form.get('text_splitter_chunk_overlap')) >=
      Number(form.get('text_splitter_chunk_size'))
    ) {
      showToast(
        'Chunk overlap cannot be larger or equal to chunk size.',
        'error'
      );
      return;
    }

    setSaving(true);
    await Admin.updateSystemPreferences({
      text_splitter_chunk_size: isNullOrNaN(
        form.get('text_splitter_chunk_size')
      )
        ? 1000
        : Number(form.get('text_splitter_chunk_size')),
      text_splitter_chunk_overlap: isNullOrNaN(
        form.get('text_splitter_chunk_overlap')
      )
        ? 1000
        : Number(form.get('text_splitter_chunk_overlap')),
    });
    setSaving(false);
    setHasChanges(false);
    showToast('Text chunking strategy settings saved.', 'success');
  };

  useEffect(() => {
    async function fetchSettings() {
      const _settings = (await Admin.systemPreferences())?.settings;
      setSettings(_settings ?? {});
      setLoading(false);
    }
    fetchSettings();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-main flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? '100%' : 'calc(100% - 32px)' }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <div className="w-full h-full flex justify-center items-center">
            <FullScreenLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? '100%' : 'calc(100% - 32px)' }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
        >
          <form
            onSubmit={handleSubmit}
            onChange={() => setHasChanges(true)}
            className="flex w-full"
          >
            <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
              <div className="w-full flex flex-col gap-y-1 pb-4 border-white border-b-2 border-opacity-10">
                <div className="flex gap-x-4 items-center">
                  <p className="text-lg leading-6 font-bold text-white">
                    Text splitting & Chunking Preferences
                  </p>
                </div>
                <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
                  Sometimes, you may want to change the default way that new
                  documents are split and chunked before being inserted into
                  your vector database. <br />
                  You should only modify this setting if you understand how text
                  splitting works and it's side effects.
                </p>
                <p className="text-xs leading-[18px] font-semibold text-white/80">
                  Changes here will only apply to{' '}
                  <i>newly embedded documents</i>, not existing documents.
                </p>
              </div>
              <div className="w-full justify-end flex">
                {hasChanges && (
                  <CTAButton className="mt-3 mr-0 -mb-14 z-10">
                    {saving ? 'Saving...' : 'Save changes'}
                  </CTAButton>
                )}
              </div>

              <div className="flex flex-col gap-y-4 mt-8">
                <div className="flex flex-col max-w-[300px]">
                  <div className="flex flex-col gap-y-2 mb-4">
                    <label className="text-white text-sm font-semibold block">
                      Text Chunk Size
                    </label>
                    <p className="text-xs text-white/60">
                      This is the maximum length of characters that can be
                      present in a single vector.
                    </p>
                  </div>
                  <input
                    type="number"
                    name="text_splitter_chunk_size"
                    min={1}
                    max={settings?.max_embed_chunk_size || 1000}
                    onWheel={(e) => e?.currentTarget?.blur()}
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="maximum length of vectorized text"
                    defaultValue={
                      isNullOrNaN(settings?.text_splitter_chunk_size)
                        ? 1000
                        : Number(settings?.text_splitter_chunk_size)
                    }
                    required={true}
                    autoComplete="off"
                  />
                  <p className="text-xs text-white/40">
                    Embed model maximum length is{' '}
                    {numberWithCommas(settings?.max_embed_chunk_size || 1000)}.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-y-4 mt-8">
                <div className="flex flex-col max-w-[300px]">
                  <div className="flex flex-col gap-y-2 mb-4">
                    <label className="text-white text-sm font-semibold block">
                      Text Chunk Overlap
                    </label>
                    <p className="text-xs text-white/60">
                      This is the maximum overlap of characters that occurs
                      during chunking between two adjacent text chunks.
                    </p>
                  </div>
                  <input
                    type="number"
                    name="text_splitter_chunk_overlap"
                    min={0}
                    onWheel={(e) => e?.currentTarget?.blur()}
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white block w-full p-2.5"
                    placeholder="maximum length of vectorized text"
                    defaultValue={
                      isNullOrNaN(settings?.text_splitter_chunk_overlap)
                        ? 20
                        : Number(settings?.text_splitter_chunk_overlap)
                    }
                    required={true}
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
