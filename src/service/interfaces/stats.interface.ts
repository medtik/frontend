export interface IHerokuMax {
  current: number;
  max: number;
}

export interface IProviderStat {
  name: string;
  resume: number;
  users: number;
}

export interface IStats {
  providers: IProviderStat[];
  health: {
    cache: IHerokuMax;
    database: IHerokuMax;
  };
  version: string;
}