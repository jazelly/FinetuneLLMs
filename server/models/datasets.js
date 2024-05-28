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
};

module.exports = { Datasets };
