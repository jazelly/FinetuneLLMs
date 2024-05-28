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
    const newDataset = await prisma.dataset.create({
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
};

module.exports = { Datasets };
