import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';

export interface ITracker {
  id?: number;
  page?: number | null;
  word?: number | null;
  recall?: boolean | null;
  connect?: boolean | null;
  tajweed?: boolean | null;
  makhraj?: boolean | null;
  createTimestamp?: dayjs.Dayjs;
  student?: IStudent | null;
}

export class Tracker implements ITracker {
  constructor(
    public id?: number,
    public page?: number | null,
    public word?: number | null,
    public recall?: boolean | null,
    public connect?: boolean | null,
    public tajweed?: boolean | null,
    public makhraj?: boolean | null,
    public createTimestamp?: dayjs.Dayjs,
    public student?: IStudent | null
  ) {
    this.recall = this.recall ?? false;
    this.connect = this.connect ?? false;
    this.tajweed = this.tajweed ?? false;
    this.makhraj = this.makhraj ?? false;
  }
}

export function getTrackerIdentifier(tracker: ITracker): number | undefined {
  return tracker.id;
}
