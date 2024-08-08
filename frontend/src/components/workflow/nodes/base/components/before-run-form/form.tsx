'use client';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import produce from 'immer';
import cn from 'classnames';
import type { InputVar } from '../../../../types';
import FormItem from './form-item';
import { InputVarType } from '@/components/workflow/types';
import { RETRIEVAL_OUTPUT_STRUCT } from '@/components/workflow/constants';
import AddButton from '../add-button';

export type Props = {
  className?: string;
  label?: string;
  inputs: InputVar[];
  values: Record<string, string>;
  onChange: (newValues: Record<string, any>) => void;
};

const Form: FC<Props> = ({ className, label, inputs, values, onChange }) => {
  const handleChange = useCallback(
    (key: string) => {
      return (value: any) => {
        const newValues = produce(values, (draft) => {
          draft[key] = value;
        });
        onChange(newValues);
      };
    },
    [values, onChange]
  );
  const isArrayLikeType = [
    InputVarType.contexts,
    InputVarType.iterator,
  ].includes(inputs[0]?.type);
  const isContext = inputs[0]?.type === InputVarType.contexts;
  const handleAddContext = useCallback(() => {
    const newValues = produce(values, (draft: any) => {
      const key = inputs[0].variable;
      draft[key].push(isContext ? RETRIEVAL_OUTPUT_STRUCT : '');
    });
    onChange(newValues);
  }, [values, onChange, inputs, isContext]);

  return (
    <div className={cn(className, 'space-y-2')}>
      {label && (
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center h-6 text-xs font-medium text-gray-500 uppercase">
            {label}
          </div>
          {isArrayLikeType && (
            <AddButton onClick={handleAddContext} text={''} />
          )}
        </div>
      )}
      {inputs.map((input, index) => {
        return (
          <FormItem
            key={index}
            payload={input}
            value={values[input.variable]}
            onChange={handleChange(input.variable)}
          />
        );
      })}
    </div>
  );
};
export default React.memo(Form);
