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
