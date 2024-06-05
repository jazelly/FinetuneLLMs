import type { Prisma } from "@prisma/client";
import { IJobJson, IJobModel } from "./schema/jobs.type";

import prisma from "../utils/prisma/index";

const Jobs = {
  create: async ({
    name,
    userId,
    trainingMethod,
    baseModel,
    datasetId,
    status,
    hyperparameters,
  }: {
    name: string;
    userId?: number;
    trainingMethod: string;
    baseModel: string;
    datasetId: number;
    status?: string;
    hyperparameters: string;
  }) => {
    const newJob = await prisma.jobs.create({
      data: {
        name,
        userId,
        trainingMethod,
        baseModel,
        datasetId,
        status,
        hyperparameters,
      },
    });

    console.log("Created new job:", newJob);
    return newJob;
  },

  readBy: async (params: Partial<IJobModel>) => {
    const whereParams: Prisma.jobsWhereInput[] = [];
    for (const [key, value] of Object.entries(params)) {
      whereParams.push({ [key]: value });
    }
    const datasets = await prisma.jobs.findMany({
      where: {
        AND: whereParams,
      },
    });

    return datasets;
  },
};

export { Jobs };
