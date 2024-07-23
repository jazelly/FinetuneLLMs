import produce from 'immer';
import { isArray, uniq } from 'lodash-es';
import type { IfElseNodeType } from '../../../if-else/types';

import { BlockEnum, InputVarType, VarType } from '@/components/workflow/types';
import type { StartNodeType } from '@/components/workflow/nodes/start/types';
import type {
  Node,
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/components/workflow/types';
import { SUPPORT_OUTPUT_VARS_NODE } from '@/components/workflow/constants';

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}
export type PromptItem = {
  role?: PromptRole;
  text: string;
};

export const VAR_REGEX =
  /\{\{(#[a-zA-Z0-9_-]{1,50}(\.[a-zA-Z_][a-zA-Z0-9_]{0,29}){1,10}#)\}\}/gi;

export const isSystemVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'sys' || valueSelector[1] === 'sys';
};

const inputVarTypeToVarType = (type: InputVarType): VarType => {
  if (type === InputVarType.number) return VarType.number;

  return VarType.string;
};

const findExceptVarInObject = (
  obj: any,
  filterVar: (payload: Var, selector: ValueSelector) => boolean,
  value_selector: ValueSelector
): Var => {
  const { children } = obj;
  const res: Var = {
    variable: obj.variable,
    type: VarType.object,
    children: children.filter((item: Var) => {
      const { children } = item;
      const currSelector = [...value_selector, item.variable];
      if (!children) return filterVar(item, currSelector);

      const obj = findExceptVarInObject(item, filterVar, currSelector);
      return obj.children && obj.children?.length > 0;
    }),
  };
  return res;
};

const formatItem = (
  item: any,
  filterVar: (payload: Var, selector: ValueSelector) => boolean
): NodeOutPutVar => {
  const { id, data } = item;

  const res: NodeOutPutVar = {
    nodeId: id,
    title: data.title,
    vars: [],
  };
  switch (data.type) {
    case BlockEnum.Start: {
      const { variables } = data as StartNodeType;
      res.vars = variables.map((v) => {
        return {
          variable: v.variable,
          type: inputVarTypeToVarType(v.type),
          isParagraph: v.type === InputVarType.paragraph,
          isSelect: v.type === InputVarType.select,
          options: v.options,
          required: v.required,
        };
      });
      res.vars.push({
        variable: 'sys.user_id',
        type: VarType.string,
      });
      res.vars.push({
        variable: 'sys.files',
        type: VarType.arrayFile,
      });
      break;
    }
  }

  const selector = [id];
  res.vars = res.vars
    .filter((v) => {
      const { children } = v;
      if (!children) return filterVar(v, selector);

      const obj = findExceptVarInObject(v, filterVar, selector);
      return obj?.children && obj?.children.length > 0;
    })
    .map((v) => {
      const { children } = v;
      if (!children) return v;

      return findExceptVarInObject(v, filterVar, selector);
    });

  return res;
};
export const toNodeOutputVars = (
  nodes: any[],
  filterVar = (_payload: Var, _selector: ValueSelector) => true
): NodeOutPutVar[] => {
  const res = nodes
    .filter((node) => SUPPORT_OUTPUT_VARS_NODE.includes(node.data.type))
    .map((node) => {
      return {
        ...formatItem(node, filterVar),
        isStartNode: node.data.type === BlockEnum.Start,
      };
    })
    .filter((item) => item.vars.length > 0);
  return res;
};

const getIterationItemType = ({
  valueSelector,
  beforeNodesOutputVars,
}: {
  valueSelector: ValueSelector;
  beforeNodesOutputVars: NodeOutPutVar[];
}): VarType => {
  const outputVarNodeId = valueSelector[0];
  const targetVar = beforeNodesOutputVars.find(
    (v) => v.nodeId === outputVarNodeId
  );
  if (!targetVar) return VarType.string;

  let arrayType: VarType = VarType.string;

  const isSystem = isSystemVar(valueSelector);
  let curr: any = targetVar.vars;

  if (isSystem)
    return curr.find((v: any) => v.variable === valueSelector.join('.'))?.type;

  valueSelector.slice(1).forEach((key, i) => {
    const isLast = i === valueSelector.length - 2;
    curr = curr?.find((v: any) => v.variable === key);
    if (isLast) {
      arrayType = curr?.type;
    } else {
      if (curr?.type === VarType.object) curr = curr.children;
    }
  });
  switch (arrayType as VarType) {
    case VarType.arrayString:
      return VarType.string;
    case VarType.arrayNumber:
      return VarType.number;
    case VarType.arrayObject:
      return VarType.object;
    case VarType.array:
      return VarType.any;
    case VarType.arrayFile:
      return VarType.object;
    default:
      return VarType.string;
  }
};

export const getVarType = ({
  parentNode,
  valueSelector,
  isIterationItem,
  availableNodes,
  isConstant,
}: {
  valueSelector: ValueSelector;
  parentNode?: Node | null;
  isIterationItem?: boolean;
  availableNodes: any[];

  isConstant?: boolean;
}): VarType => {
  if (isConstant) return VarType.string;

  const beforeNodesOutputVars = toNodeOutputVars(availableNodes);

  const isSystem = isSystemVar(valueSelector);
  const startNode = availableNodes.find((node: any) => {
    return node.data.type === BlockEnum.Start;
  });

  const targetVarNodeId = isSystem ? startNode?.id : valueSelector[0];
  const targetVar = beforeNodesOutputVars.find(
    (v) => v.nodeId === targetVarNodeId
  );

  if (!targetVar) return VarType.string;

  let type: VarType = VarType.string;
  let curr: any = targetVar.vars;
  if (isSystem) {
    return curr.find(
      (v: any) => v.variable === (valueSelector as ValueSelector).join('.')
    )?.type;
  } else {
    (valueSelector as ValueSelector).slice(1).forEach((key, i) => {
      const isLast = i === valueSelector.length - 2;
      curr = curr.find((v: any) => v.variable === key);
      if (isLast) {
        type = curr?.type;
      } else {
        if (curr.type === VarType.object) curr = curr.children;
      }
    });
    return type;
  }
};

// node output vars + parent inner vars(if in iteration or other wrap node)
export const toNodeAvailableVars = ({
  parentNode,
  t,
  beforeNodes,
  filterVar,
}: {
  parentNode?: Node | null;
  t?: any;
  // to get those nodes output vars
  beforeNodes: Node[];

  filterVar: (payload: Var, selector: ValueSelector) => boolean;
}): NodeOutPutVar[] => {
  const beforeNodesOutputVars = toNodeOutputVars(beforeNodes, filterVar);
  return beforeNodesOutputVars;
};

export const getNodeInfoById = (nodes: any, id: string) => {
  if (!isArray(nodes)) return;
  return nodes.find((node: any) => node.id === id);
};

const matchNotSystemVars = (prompts: string[]) => {
  if (!prompts) return [];

  const allVars: string[] = [];
  prompts.forEach((prompt) => {
    VAR_REGEX.lastIndex = 0;
    if (typeof prompt !== 'string') return;
    allVars.push(...(prompt.match(VAR_REGEX) || []));
  });
  const uniqVars = uniq(allVars).map((v) =>
    v.replaceAll('{{#', '').replace('#}}', '').split('.')
  );
  return uniqVars;
};

const replaceOldVarInText = (
  text: string,
  oldVar: ValueSelector,
  newVar: ValueSelector
) => {
  if (!text || typeof text !== 'string') return text;

  if (!newVar || newVar.length === 0) return text;

  return text.replaceAll(
    `{{#${oldVar.join('.')}#}}`,
    `{{#${newVar.join('.')}#}}`
  );
};

export const getNodeUsedVars = (node: Node): ValueSelector[] => {
  const { data } = node;
  const { type } = data;
  let res: ValueSelector[] = [];
  switch (type) {
    case BlockEnum.IfElse: {
      res = (data as IfElseNodeType).conditions?.map((c) => {
        return c.variable_selector;
      });
      break;
    }
  }
  return res || [];
};

// used can be used in iteration node
export const getNodeUsedVarPassToServerKey = (
  node: Node,
  valueSelector: ValueSelector
): string | string[] => {
  const { data } = node;
  const { type } = data;
  let res: string | string[] = '';
  switch (type) {
    case BlockEnum.IfElse: {
      const targetVar = (data as IfElseNodeType).conditions?.find(
        (c) => c.variable_selector.join('.') === valueSelector.join('.')
      );
      if (targetVar) res = `#${valueSelector.join('.')}#`;
      break;
    }
  }
  return res;
};

export const findUsedVarNodes = (
  varSelector: ValueSelector,
  availableNodes: Node[]
): Node[] => {
  const res: Node[] = [];
  availableNodes.forEach((node) => {
    const vars = getNodeUsedVars(node);
    if (vars.find((v) => v.join('.') === varSelector.join('.'))) res.push(node);
  });
  return res;
};

export const updateNodeVars = (
  oldNode: Node,
  oldVarSelector: ValueSelector,
  newVarSelector: ValueSelector
): Node => {
  const newNode = produce(oldNode, (draft: any) => {
    const { data } = draft;
    const { type } = data;

    switch (type) {
      case BlockEnum.IfElse: {
        const payload = data as IfElseNodeType;
        if (payload.conditions) {
          payload.conditions = payload.conditions.map((c) => {
            if (c.variable_selector.join('.') === oldVarSelector.join('.'))
              c.variable_selector = newVarSelector;
            return c;
          });
        }
        break;
      }
    }
  });
  return newNode;
};
const varToValueSelectorList = (
  v: Var,
  parentValueSelector: ValueSelector,
  res: ValueSelector[]
) => {
  if (!v.variable) return;

  res.push([...parentValueSelector, v.variable]);

  if (v.children && v.children.length > 0) {
    v.children.forEach((child) => {
      varToValueSelectorList(child, [...parentValueSelector, v.variable], res);
    });
  }
};

const varsToValueSelectorList = (
  vars: Var | Var[],
  parentValueSelector: ValueSelector,
  res: ValueSelector[]
) => {
  if (Array.isArray(vars)) {
    vars.forEach((v) => {
      varToValueSelectorList(v, parentValueSelector, res);
    });
  }
  varToValueSelectorList(vars as Var, parentValueSelector, res);
};

export const getNodeOutputVars = (node: Node): ValueSelector[] => {
  const { data, id } = node;
  const { type } = data;
  let res: ValueSelector[] = [];

  switch (type) {
    case BlockEnum.Start: {
      const { variables } = data as StartNodeType;
      res = variables.map((v) => {
        return [id, v.variable];
      });

      break;
    }
  }

  return res;
};
