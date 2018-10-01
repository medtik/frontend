export class ProviderModel {
  public readonly name: string = '';
  public redirectUrl: string|null = null;
  public logged: boolean = false;
  constructor(data: string|ProviderModel) {
    if (data instanceof ProviderModel) {
      Object.assign(this, data);
    } else {
      this.name = data;
    }
  }
}
