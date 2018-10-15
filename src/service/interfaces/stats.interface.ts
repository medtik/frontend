export interface IHerokuMax {
  current: number;
  max: number;
}

export interface IProviderStat {
  provider: string;
  accounts: number;
  resume: number;
}

export interface IStats {
  statistics: IProviderStat[];
  health: {
    cache: IHerokuMax;
    database: IHerokuMax;
  };
}