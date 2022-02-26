export interface IInstitute {
  id?: number;
  name?: string;
  phone?: string;
  website?: string | null;
  email?: string | null;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export class Institute implements IInstitute {
  constructor(
    public id?: number,
    public name?: string,
    public phone?: string,
    public website?: string | null,
    public email?: string | null,
    public street?: string,
    public city?: string,
    public state?: string,
    public zip?: string
  ) {}
}

export function getInstituteIdentifier(institute: IInstitute): number | undefined {
  return institute.id;
}
