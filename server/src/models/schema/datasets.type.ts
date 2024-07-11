export interface ModelBase {
  id?: number;
  createdAt?: Date;
  lastUpdatedAt?: Date;
}

export interface DatasetBase extends ModelBase {
  name: string;
  size: number;
  extension: string;
  numRows?: number;
}

export interface DatasetLocal extends DatasetBase {}

export interface DatasetRemote extends DatasetBase {
  path?: string | null;
  config: string;
  split: string;
  source: string;
}
