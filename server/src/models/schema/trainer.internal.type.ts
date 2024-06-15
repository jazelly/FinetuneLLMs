import { IDataset } from "./datasets.type";

export interface SubmitJobParams {
  baseModel: string;
  trainingMethod: string;
  dataset: Pick<IDataset, "name">;
  hyperparameters?: Record<string, any>;
}
