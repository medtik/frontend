import {IResume, ResumeModel} from "./resume.model";

export class ProviderModel {
  public readonly name: string = '';
  public redirectUrl?: string|null = null;
  public logged: boolean = false;
  public resumes: ResumeModel[] = [];

  constructor(data: IProvider|ProviderModel) {
    if (data instanceof ProviderModel) {
      Object.assign(this, data);
    } else {
      this.name = data.provider;
      this.resumes = data.resume.map(i => new ResumeModel(i));
    }
  }
}

export interface IProvider {
  provider: string;
  resume: IResume[];
}