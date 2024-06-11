import { IDataset } from "./datasets.type";

export interface SubmitJobParams {
  baseModel: string;
  trainingMethod: string;
  dataset: IDataset;
  hyperparameters: Record<string, any>;
}
