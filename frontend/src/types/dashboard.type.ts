export interface TrainerResponseWS {
  type?: 'info' | 'warning' | 'error';
  status: 'success' | 'failed' | 'error';
  message: string;
  code: number;
  data?: Record<string, any>;
}

export interface TrainerPayload {
  type: 'command';
  message: string;
  data?: Record<string, any>;
}

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

interface HTTPResponse {
  success: boolean;
}

export interface HTTPResponseSuccess<T> extends HTTPResponse {
  success: true;
  data: T;
}

export interface HTTPResponseError extends HTTPResponse {
  success: false;
  error: string;
}

export interface JobCreate {
  baseModel: string;
  trainingMethod: string;
  datasetName: string;
  hyperparameters: Record<string, string | number | boolean>;
}

export interface JobDetail extends JobCreate {
  id: string;
  status: string;
  taskId?: string;
}

export interface TrainingMethod {
  name: string;
  fullName: string;
  explanation: string;
  externalLink?: string;
}

export interface AllJobOptions {
  baseModels: Array<string>;
  trainingMethods: Array<TrainingMethod>;
  datasets: Array<Record<string, any>>;
  hyperparameters: Record<string, string | number | boolean>;
}
