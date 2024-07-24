import type { FC } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import type { StartNodeType } from './types';
import type { InputVar, NodePanelProps } from '@/components/workflow/types';
import useConfig from './use-config';
import AddButton from '../base/components/add-button';
import VarList from './components/var-list';
import Field from '../base/components/field';
import Split from '../base/components/split';
import VarItem from './components/var-item';

const i18nPrefix = 'workflow.nodes.start';

const Panel: FC<NodePanelProps<StartNodeType>> = ({ id, data }) => {
  const { t } = useTranslation();
  const {
    readOnly,
    inputs,
    showAddVarModal,
    handleAddVariable,
    hideAddVarModal,
    handleVarListChange,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm,
  } = useConfig(id, data);

  const handleAddVarConfirm = (payload: InputVar) => {
    handleAddVariable(payload);
    hideAddVarModal();
  };

  return (
    <div className="mt-2">
      <div className="px-4 pb-2 space-y-4">
        <Field
          title={t(`${i18nPrefix}.inputField`)}
          operations={
            !readOnly ? (
              <AddButton onClick={showAddVarModal} text={'add'} />
            ) : undefined
          }
        >
          <>
            <VarList
              readonly={readOnly}
              list={inputs.variables || []}
              onChange={handleVarListChange}
            />

            <div className="mt-1 space-y-1">
              <Split className="my-2" />
              (
              <VarItem
                readonly
                payload={
                  {
                    variable: 'sys.query',
                  } as any
                }
                rightContent={
                  <div className="text-xs font-normal text-gray-500">
                    String
                  </div>
                }
              />
              )
              <VarItem
                readonly
                payload={
                  {
                    variable: 'sys.files',
                  } as any
                }
                rightContent={
                  <div className="text-xs font-normal text-gray-500">
                    Array[File]
                  </div>
                }
              />
              {
                <VarItem
                  readonly
                  payload={
                    {
                      variable: 'sys.conversation_id',
                    } as any
                  }
                  rightContent={
                    <div className="text-xs font-normal text-gray-500">
                      String
                    </div>
                  }
                />
              }
              <VarItem
                readonly
                payload={
                  {
                    variable: 'sys.user_id',
                  } as any
                }
                rightContent={
                  <div className="text-xs font-normal text-gray-500">
                    String
                  </div>
                }
              />
            </div>
          </>
        </Field>
      </div>
    </div>
  );
};

export default React.memo(Panel);
