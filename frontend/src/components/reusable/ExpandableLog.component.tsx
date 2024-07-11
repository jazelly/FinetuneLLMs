import { CaretDown, CaretRight, CaretUp } from '@phosphor-icons/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandableLogProps {
  title: string;
  logs: string[];
}

const StyledLineNumber = styled.div`
  unicode-bidi: isolate;
`;

const ExpandableLog: React.FC<ExpandableLogProps> = ({ title, logs }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const iconVariants = {
    expanded: { rotate: 90, transition: { duration: 0.2 } },
    collapsed: { rotate: 0, transition: { duration: 0.2 } },
  };

  const logVariants = {
    expanded: { opacity: 1, height: 'auto' },
    collapsed: { opacity: 0, height: 0 },
  };

  return (
    <div className={`rounded-lg w-full`}>
      <div
        data-key="pipeline-log-header"
        className={`flex justify-between items-center cursor-pointer expandable-log rounded-lg px-3 w-full h-12 text-main-log-white ${hovered || isExpanded ? 'bg-pipeline-highlight' : ''}`}
        onClick={toggleExpand}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <span className="text-sm">{title}</span>
        <motion.div
          animate={isExpanded ? 'expanded' : 'collapsed'}
          variants={iconVariants}
        >
          <CaretRight size={16} weight="bold" />
        </motion.div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            data-key="log-group-detail"
            className="log-content gap-y-1"
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={logVariants}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {logs.map((log, index) => (
              <div key={index} className="flex text-xs text-white">
                <StyledLineNumber className="text-center w-8">
                  {index + 1}
                </StyledLineNumber>
                <span className="text-xs flex-1">{log}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableLog;
