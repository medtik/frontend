import {IResume, ResumeModel} from "./resume.model";

export class ProviderModel {
  public readonly name: string = '';
  public redirectUrl?: string|null = null;
  public logged: boolean = false;
  public resumes: ResumeModel[] = [];

  constructor(data: string|ProviderModel) {
    if (data instanceof ProviderModel) {
      Object.assign(this, data);
    } else {
      this.name = data;
    }
  }
}

export interface IProvider {
  [key: string]: IResume[];
}