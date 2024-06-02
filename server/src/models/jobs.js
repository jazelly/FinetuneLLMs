const prisma = require("../utils/prisma");

const Jobs = {
  create: async ({
    userId,
    trainingMethod,
    baseModel,
    datasetId,
    status,
    hyperparameters,
  }) => {
    const newJob = await prisma.jobs.create({
      data: {
        userId,
        trainingMethod,
        baseModel,
        datasetId,
        status,
        hyperparameters,
      },
    });
    console.log("Created new job:", newJob);
  },

  readBy: async (params) => {
    const whereParams = [];
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

module.exports = { Jobs };
