import {IStats} from '../../service/interfaces';

export interface StatsGroupItem {
  label: string;
  count: number;
}

export interface StatsGroup {
  label: 'resume'|'users';
  items: StatsGroupItem[];
}

export class StatsModel {
  public readonly db: number = 0;
  public readonly cache: number = 0;
  public readonly groups: StatsGroup[] = [];
  constructor(data?: IStats) {
    if (!data) return;
    this.db = data.health.db.current/ data.health.db.max * 100;
    this.cache = data.health.cache.current/ data.health.cache.max * 100;
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
