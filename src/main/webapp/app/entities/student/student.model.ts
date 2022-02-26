import dayjs from 'dayjs/esm';
import { IInstitute } from 'app/entities/institute/institute.model';

export interface IStudent {
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

export class Student implements IStudent {
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

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
