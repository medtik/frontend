import {IStats} from '../../service/interfaces';

export interface StatsGroupItem {
  label: string;
  count: number;
}

export interface StatsGroup {
  label: 'resume'|'users';
  items: StatsGroupItem[];
}

export class LimitModel {
  public readonly usage: number = 0;
  public readonly current: number = 0;
  public readonly max: number = 0;
  constructor(current?: number, max?: number) {
    if (!current || !max) {
      return;
    }
    this.current = current;
    this.max = max;
    this.usage = this.current / this.max * 100;
  }
}

export class StatusModel {
  public readonly database: LimitModel = new LimitModel();
  public readonly cache: LimitModel = new LimitModel();
  public readonly groups: StatsGroup[] = [];
  public readonly version: string = null;

  constructor(data?: IStats) {
    if (!data) return;
    this.version = data.version;
    this.database = new LimitModel(data.health.database.current, data.health.database.max);
    this.cache = new LimitModel(data.health.cache.current, data.health.cache.max);
    this.groups.push(this._makeGroup('resume', data));
    this.groups.push(this._makeGroup('users', data));
  }

  private _makeGroup(label: 'users'|'resume', data?: IStats): StatsGroup {
    const group: StatsGroup = {
      label,
      items: [],
    };
    if (data.providers.length) {
      for(let provider of data.providers) {
        group.items.push({
          label: provider.name,
          count: provider[label],
        })
      }
    }
    return group;
  }

}
