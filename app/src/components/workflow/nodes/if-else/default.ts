import { BlockEnum, type NodeDefault } from '../../types';
import { type IfElseNodeType, LogicalOperator } from './types';
import { isEmptyRelatedOperator } from './utils';
import { ALL_COMPLETION_AVAILABLE_BLOCKS } from '@/src/components/workflow/constants';
const i18nPrefix = 'workflow.errorMsg';

const nodeDefault: NodeDefault<IfElseNodeType> = {
  defaultValue: {
    _targetBranches: [
      {
        id: 'true',
        name: 'IS TRUE',
      },
      {
        id: 'false',
        name: 'IS FALSE',
      },
    ],
    logical_operator: LogicalOperator.and,
    conditions: [],
  },
  getAvailablePrevNodes() {
    return ALL_COMPLETION_AVAILABLE_BLOCKS;
  },
  getAvailableNextNodes() {
    const nodes = ALL_COMPLETION_AVAILABLE_BLOCKS;
    return nodes;
  },
  checkValid(payload: IfElseNodeType, t: any) {
    let errorMessages = '';
    const { conditions } = payload;
    if (!conditions || conditions.length === 0)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: 'IF' });

    conditions.forEach((condition) => {
      if (
        !errorMessages &&
        (!condition.variable_selector ||
          condition.variable_selector.length === 0)
      )
        errorMessages = t(`${i18nPrefix}.fieldRequired`, {
          field: t(`${i18nPrefix}.fields.variable`),
        });
      if (!errorMessages && !condition.comparison_operator)
        errorMessages = t(`${i18nPrefix}.fieldRequired`, {
          field: t('workflow.nodes.ifElse.operator'),
        });
      if (
        !errorMessages &&
        !isEmptyRelatedOperator(condition.comparison_operator!) &&
        !condition.value
      )
        errorMessages = t(`${i18nPrefix}.fieldRequired`, {
          field: t(`${i18nPrefix}.fields.variableValue`),
        });
    });
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    };
  },
};

export default nodeDefault;
