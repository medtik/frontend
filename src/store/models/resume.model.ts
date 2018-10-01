export interface IResume {
  enabled: boolean;
  link: string;
  name: string;
  published: string|Date;
  title: string;
  uniq: string;
}

export class ResumeModel implements IResume {
  public enabled: boolean = false;
  public readonly link: string = null;
  public readonly name: string = null;
  public readonly published: string = null;
  public readonly title: string = null;
  public readonly uniq: string = null;

  public get label(): string {
    return `<b>${this.title}</b> &mdash; ${this.published}`;
  }

  constructor(data: IResume) {
    Object.assign(this, data);
    this.published = new Date(data.published).toLocaleString();
  }
}
