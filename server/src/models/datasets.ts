import prisma from "../utils/prisma/index";
import type { Prisma } from "@prisma/client";
import type { DatasetRemote } from "./schema/datasets.type";

export const Datasets = {
  create: async ({
    name,
    extension,
    path,
    size,
    source,
    config,
    split,
    numRows,
  }: DatasetRemote) => {
    await prisma.datasets.deleteMany({
      where: { name, source, config, split },
    });
    console.log("found duplicated, delete first");

    const newDataset = await prisma.datasets.create({
      data: {
        name,
        extension,
        path,
        size,
        source,
        config,
        split,
        numRows,
      },
    });
    console.log("Created new dataset:", newDataset);
  },

  readAll: async () => {
    const datasets = await prisma.datasets.findMany();
    return datasets;
  },

  readBy: async (params: Partial<DatasetRemote>) => {
    const whereParams: Prisma.datasetsWhereInput[] = [];
    for (const [key, value] of Object.entries(params)) {
      whereParams.push({ [key]: value });
    }
    const datasets = await prisma.datasets.findMany({
      where: {
        AND: whereParams,
      },
    });

    return datasets;
  },

  deleteAllByName: async (name: string) => {
    await prisma.datasets.deleteMany({
      where: {
        name,
      },
    });
  },
};
