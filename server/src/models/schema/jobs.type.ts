export interface IJobBase {
  id: number;
  name: string;
  userId?: number;
  baseModel: string;
  datasetId: string;
  trainingMethod: string;
  status: string;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface IJobModel extends IJobBase {
  hyperparameters: string;
}

export interface IJobJson<T extends {}> extends IJobBase {
  hyperparameters: T;
}
