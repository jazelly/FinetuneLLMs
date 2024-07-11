import type { AllJobOptions, JobDetail } from '@/types/dashboard.type';
import React, { useContext, useEffect, useState } from 'react';
import { LoadingSpinner } from './reusable/Loaders.component';
import {
  TrainerMessage,
  TrainerMessageMapContext,
} from '@/contexts/TrainerMessageMap.context';
import { MagnifyingGlass, Question } from '@phosphor-icons/react';
import HoverableIcon from './reusable/HoverableIcon.component';
import styled from 'styled-components';
import ExpandableLog from './reusable/ExpandableLog.component';
import { ReadyState } from 'react-use-websocket';

export interface DetailPanelProps {
  jobDetail: JobDetail | undefined;
  jobDetailLoading: boolean;
}

export interface LogEntry {
  title: string;
  logs: string[];
}

const DetailPanel = ({ jobDetail, jobDetailLoading }: DetailPanelProps) => {
  const { messageMap, readyState } = useContext(TrainerMessageMapContext);

  if (jobDetailLoading || readyState !== ReadyState.OPEN)
    return (
      <div className="flex flex-col bg-main-gradient h-full justify-center items-center">
        <LoadingSpinner size={80} color={'#3c97fd'} />
        <span className="text-white">Loading</span>
      </div>
    );

  // TODO: get job list based on id
  let firstJobList: TrainerMessage[] = [];
  for (const key in messageMap) {
    firstJobList = messageMap[key];
    break;
  }

  const test: any[] = [
    { type: 'title', data: { log: 'This is section 1 1111 1' } },
    {
      type: 'detail',
      data: {
        log: 'GIT_LFS_SKIP_SMUDGE=1 retry 6 git clone --branch="WOR-5245-allow-admin-to-complete-form3-phase-2" --depth 50 https://x-token-auth:$REPOSITORY_OAUTH_ACCESS_TOKEN@bitbucket.org/$BITBUCKET_REPO_FULL_NAME.git $BUILD_DI',
      },
    },
    { type: 'detail', data: { log: 'This is job log 3' } },
    { type: 'detail', data: { log: 'This is job log 4' } },
    { type: 'detail', data: { log: 'This is job log 5' } },
    { type: 'title', data: { log: 'This is section 2' } },
    { type: 'detail', data: { log: 'This is job log 2' } },
    { type: 'title', data: { log: 'This is a section 3' } },
    { type: 'detail', data: { log: 'This is job log 2' } },
  ];

  const groupLogs = (logs: TrainerMessage[]): LogEntry[] => {
    const result: LogEntry[] = [];

    let grouped: LogEntry = { title: '', logs: [] };

    logs.forEach((entry) => {
      if (entry.type === 'title') {
        if (grouped.logs.length) result.push(grouped);
        grouped = { title: entry.data.log, logs: [] };
      } else if (entry.type === 'detail') {
        // leading details are allowed
        grouped.logs.push(entry.data.log);
      }
    });

    if (grouped.logs.length) result.push(grouped);

    return result;
  };

  const groupedLogs = groupLogs(test);

  return (
    <div
      className={`flex flex-col items-startstart bg-main-gradient py-5 px-5 gap-y-4 h-full w-full`}
    >
      <div
        id="pipeline-header"
        className="flex justify-between items-center h-10 border-b-2"
      >
        <div
          id="pipeline-header"
          className="flex items-center justify-center text-main-log-lightblue font-semibold text-base border-b-2 border-main-outline"
        >
          <span>Logs</span>
        </div>
        <div
          id="pipeline-header-icongroup"
          className="flex justify-center items-center"
        >
          <HoverableIcon
            hoverBackgroundColor="#DCF2FF"
            tooltipText="What is this"
            color="#dfe1e6"
            hoverFill="#C4A1BC"
          >
            <MagnifyingGlass size={26} weight="bold" />
          </HoverableIcon>
          <HoverableIcon
            hoverBackgroundColor="#DCF2FF"
            tooltipText="What is this"
            color="#dfe1e6"
            hoverFill="#C4A1BC"
          >
            <Question size={26} weight="bold" />
          </HoverableIcon>
        </div>
      </div>
      {groupedLogs.map((logGroup) => {
        return <ExpandableLog title={logGroup.title} logs={logGroup.logs} />;
      })}
    </div>
  );
};

export default DetailPanel;
