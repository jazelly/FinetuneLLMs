export interface IDataset {
  id: string;
  name: string;
  path?: string;
  config: string;
  split: string;
  size: number;
  source: string;
  extension: string;
  numRows?: number;
  createdAt: Date;
  lastUpdatedAt: Date;
}

export interface JobCreate {
  baseModel: string;
  trainingMethod: string;
  datasetId: number;
  hyperparameters: Record<string, string | number | boolean>;
}

export interface IJobDetail extends JobCreate {
  id: string;
  status: string;
}

export interface AllJobOptions {
  baseModels: Array<string>;
  trainingMethods: Array<string>;
  datasets: Array<Record<string, any>>;
  hyperparameters: Record<string, string | number | boolean>;
}
