const prisma = require("../utils/prisma");

const Datasets = {
  create: async ({
    name,
    extension,
    path,
    size,
    source,
    config,
    split,
    numRows,
  }) => {
    const whereParams = [{ name, source, config, split }];

    await prisma.datasets.deleteMany({
      where: {
        whereParams,
      },
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

  readBy: async (params) => {
    const whereParams = [];
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

  deleteAllByName: async (name) => {
    await prisma.datasets.deleteMany({
      where: {
        name,
      },
    });
  },
};

module.exports = { Datasets };
