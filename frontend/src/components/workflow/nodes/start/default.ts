import type { NodeDefault } from '../../types';
import type { StartNodeType } from './types';
import {
  ALL_CHAT_AVAILABLE_BLOCKS,
  ALL_COMPLETION_AVAILABLE_BLOCKS,
} from '@/components/workflow/constants';

const StartNodeDefault: NodeDefault<StartNodeType> = {
  defaultValue: {
    variables: [],
  },
  getAvailablePrevNodes() {
    return [];
  },
  getAvailableNextNodes() {
    const nodes = 
      ? ALL_CHAT_AVAILABLE_BLOCKS
      : ALL_COMPLETION_AVAILABLE_BLOCKS;
    return nodes;
  },
  checkValid() {
    return {
      isValid: true,
    };
  },
};

export default StartNodeDefault;
