export interface IHerokuMax {
  max: number;
  total: number;
}

export interface IProviderStat {
  [key: string]: number
}

export interface IStats {
  users: {
    items: IProviderStat[];
    total: number;
  },
  resume: {
    items: IProviderStat[];
    total: number;
  },
  db: {
    memory: IHerokuMax;
    rows: IHerokuMax;
  }
}