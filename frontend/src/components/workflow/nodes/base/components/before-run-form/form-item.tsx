'use client';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import produce from 'immer';
import type { InputVar } from '../../../../types';
import { BlockEnum, InputVarType } from '../../../../types';
import CodeEditor from '../editor/code-editor';
import TextEditor from '../editor/text-editor';
import { VarBlockIcon } from '../../../icons';
import Line from '../next-step/line';
import { Trash, VideoCamera } from '@phosphor-icons/react';

type Props = {
  payload: InputVar;
  value: any;
  onChange: (value: any) => void;
  className?: string;
  autoFocus?: boolean;
};

const FormItem: FC<Props> = ({
  payload,
  value,
  onChange,
  className,
  autoFocus,
}) => {
  const { t } = useTranslation();
  const { type } = payload;
  const handleArrayItemChange = useCallback(
    (index: number) => {
      return (newValue: any) => {
        const newValues = produce(value, (draft: any) => {
          draft[index] = newValue;
        });
        onChange(newValues);
      };
    },
    [value, onChange]
  );

  const handleArrayItemRemove = useCallback(
    (index: number) => {
      return () => {
        const newValues = produce(value, (draft: any) => {
          draft.splice(index, 1);
        });
        onChange(newValues);
      };
    },
    [value, onChange]
  );
  const nodeKey = (() => {
    if (typeof payload.label === 'object') {
      const { nodeType, nodeName, variable } = payload.label;
      return (
        <div className="h-full flex items-center">
          <div className="flex items-center">
            <div className="p-[1px]">
              <VarBlockIcon type={nodeType || BlockEnum.Start} />
            </div>
            <div
              className="mx-0.5 text-xs font-medium text-gray-700 max-w-[150px] truncate"
              title={nodeName}
            >
              {nodeName}
            </div>
          </div>

          <div className="flex items-center text-primary-600">
            <VideoCamera className="w-3.5 h-3.5" />
            <div
              className="ml-0.5 text-xs font-medium max-w-[150px] truncate"
              title={variable}
            >
              {variable}
            </div>
          </div>
        </div>
      );
    }
    return '';
  })();

  const isArrayLikeType = [
    InputVarType.contexts,
    InputVarType.iterator,
  ].includes(type);
  const isContext = type === InputVarType.contexts;
  const isIterator = type === InputVarType.iterator;
  return (
    <div className={`${className}`}>
      {!isArrayLikeType && (
        <div className="h-8 leading-8 text-[13px] font-medium text-gray-700 truncate">
          {typeof payload.label === 'object' ? nodeKey : payload.label}
        </div>
      )}
      <div className="grow">
        {type === InputVarType.textInput && (
          <input
            className="w-full px-3 text-sm leading-8 text-gray-900 border-0 rounded-lg grow h-8 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200"
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('appDebug.variableConig.inputPlaceholder')!}
            autoFocus={autoFocus}
          />
        )}

        {type === InputVarType.number && (
          <input
            className="w-full px-3 text-sm leading-8 text-gray-900 border-0 rounded-lg grow h-8 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200"
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('appDebug.variableConig.inputPlaceholder')!}
            autoFocus={autoFocus}
          />
        )}

        {type === InputVarType.paragraph && (
          <textarea
            className="w-full px-3 py-1 text-sm leading-[18px] text-gray-900 border-0 rounded-lg grow h-[120px] bg-gray-50 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-200"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t('appDebug.variableConig.inputPlaceholder')!}
            autoFocus={autoFocus}
          />
        )}

        {type === InputVarType.json && (
          <CodeEditor
            value={value}
            title={<span>JSON</span>}
            language={''}
            onChange={onChange}
          />
        )}

        {isContext && (
          <div className="space-y-2">
            {(value || []).map((item: any, index: number) => (
              <CodeEditor
                key={index}
                value={item}
                title={<span>JSON</span>}
                headerRight={
                  (value as any).length > 1 ? (
                    <Trash
                      onClick={handleArrayItemRemove(index)}
                      className="mr-1 w-3.5 h-3.5 text-gray-500 cursor-pointer"
                    />
                  ) : undefined
                }
                language={'python3'}
                onChange={handleArrayItemChange(index)}
              />
            ))}
          </div>
        )}

        {isIterator && (
          <div className="space-y-2">
            {(value || []).map((item: any, index: number) => (
              <TextEditor
                key={index}
                isInNode
                value={item}
                title={
                  <span>
                    {t('appDebug.variableConig.content')} {index + 1}{' '}
                  </span>
                }
                onChange={handleArrayItemChange(index)}
                headerRight={
                  (value as any).length > 1 ? (
                    <Trash
                      onClick={handleArrayItemRemove(index)}
                      className="mr-1 w-3.5 h-3.5 text-gray-500 cursor-pointer"
                    />
                  ) : undefined
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default React.memo(FormItem);
