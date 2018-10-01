import {IStats} from '../../service/interfaces';

export interface StatsGroupItem {
  label: string;
  count: number;
}

export interface StatsGroup {
  label: string;
  items: StatsGroupItem[];
}

export class StatsModel {
  public readonly memoryUsage: number = 0;
  public readonly rowsUsage: number = 0;
  public readonly groups: StatsGroup[] = [];
  constructor(data?: IStats) {
    if (!data) return;
    this.memoryUsage = data.db.memory.total/ data.db.memory.max * 100;
    this.rowsUsage = data.db.rows.total/ data.db.rows.max * 100;
    this.groups.push(this._makeGroup('resume', data));
    this.groups.push(this._makeGroup('users', data));
  }

  private _makeGroup(label: 'users'|'resume', data?: IStats): StatsGroup {
    const group: StatsGroup = {
      label,
      items: [],
    };
    if (data[label].items.length) {
      for(let user of data[label].items) {
        for(let key in user) {
          group.items.push({
            label: key,
            count: user[key],
          })
        }
      }
    }
    return group;
  }

}
