import {StatsModel} from "../models/stats.model";

export interface RootState {
  PACKAGE_JSON: any;
  busy: boolean;
  workers: number[];
  error: string|null;
  token: string;
  stats: StatsModel;
}
