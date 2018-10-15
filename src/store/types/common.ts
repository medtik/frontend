import {StatusModel} from "../models/status.model";

export interface RootState {
  PACKAGE_JSON: any;
  busy: boolean;
  workers: number[];
  error: string|null;
  token: string;
  status: StatusModel;
  backendVersion: string;
}
