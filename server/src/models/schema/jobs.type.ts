export interface IJobCreate {
  taskId?: string;
  name: string;
  userId?: number;
  baseModel: string;
  datasetName: string;
  trainingMethod: string;
  hyperparameters: string;
  status?: string;
}

export interface IJobModel extends IJobCreate {
  id: number;
  createdAt: Date;
  lastUpdatedAt: Date;
  status: string;
}

