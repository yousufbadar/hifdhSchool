import dayjs from 'dayjs/esm';
import { IInstitute } from 'app/entities/institute/institute.model';

export interface ITeacher {
  id?: number;
  firstName?: string;
  middleName?: string | null;
  lastName?: string;
  likeToBeCalled?: string | null;
  birthDate?: dayjs.Dayjs;
  photoContentType?: string | null;
  photo?: string | null;
  cellPhone?: string;
  homePhone?: string | null;
  email?: string | null;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  institute?: IInstitute;
}

export class Teacher implements ITeacher {
  constructor(
    public id?: number,
    public firstName?: string,
    public middleName?: string | null,
    public lastName?: string,
    public likeToBeCalled?: string | null,
    public birthDate?: dayjs.Dayjs,
    public photoContentType?: string | null,
    public photo?: string | null,
    public cellPhone?: string,
    public homePhone?: string | null,
    public email?: string | null,
    public street?: string,
    public city?: string,
    public state?: string,
    public zip?: string,
    public institute?: IInstitute
  ) {}
}

export function getTeacherIdentifier(teacher: ITeacher): number | undefined {
  return teacher.id;
}
