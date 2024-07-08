import { DatasetRemote } from "./datasets.type";

export interface SubmitJobParams {
  baseModel: string;
  trainingMethod: string;
  dataset: Pick<DatasetRemote, "name">;
  hyperparameters?: Record<string, any>;
}
