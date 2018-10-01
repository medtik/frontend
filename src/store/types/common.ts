import {StatsModel} from "../models/stats.model";

export interface RootState {
  version: string;
  busy: boolean;
  workers: number[];
  error: string|null;
  token: string;
  stats: StatsModel;
}
