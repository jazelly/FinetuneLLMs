export interface IDataset {
  id: number;
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
