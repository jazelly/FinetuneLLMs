import type { Prisma } from "@prisma/client";
import { IJobCreate, IJobModel } from "./schema/jobs.type";

import prisma from "../utils/prisma/index";

const Jobs = {
  create: async ({
    taskId,
    name,
    userId,
    trainingMethod,
    baseModel,
    datasetName,
    status,
    hyperparameters,
  }: IJobCreate) => {
    const newJob = await prisma.jobs.create({
      data: {
        taskId,
        name,
        userId,
        trainingMethod,
        baseModel,
        datasetName,
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
