import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInstitute, getInstituteIdentifier } from '../institute.model';

export type EntityResponseType = HttpResponse<IInstitute>;
export type EntityArrayResponseType = HttpResponse<IInstitute[]>;

@Injectable({ providedIn: 'root' })
export class InstituteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/institutes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(institute: IInstitute): Observable<EntityResponseType> {
    return this.http.post<IInstitute>(this.resourceUrl, institute, { observe: 'response' });
  }

  update(institute: IInstitute): Observable<EntityResponseType> {
    return this.http.put<IInstitute>(`${this.resourceUrl}/${getInstituteIdentifier(institute) as number}`, institute, {
      observe: 'response',
    });
  }

  partialUpdate(institute: IInstitute): Observable<EntityResponseType> {
    return this.http.patch<IInstitute>(`${this.resourceUrl}/${getInstituteIdentifier(institute) as number}`, institute, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInstitute>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInstitute[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInstituteToCollectionIfMissing(
    instituteCollection: IInstitute[],
    ...institutesToCheck: (IInstitute | null | undefined)[]
  ): IInstitute[] {
    const institutes: IInstitute[] = institutesToCheck.filter(isPresent);
    if (institutes.length > 0) {
      const instituteCollectionIdentifiers = instituteCollection.map(instituteItem => getInstituteIdentifier(instituteItem)!);
      const institutesToAdd = institutes.filter(instituteItem => {
        const instituteIdentifier = getInstituteIdentifier(instituteItem);
        if (instituteIdentifier == null || instituteCollectionIdentifiers.includes(instituteIdentifier)) {
          return false;
        }
        instituteCollectionIdentifiers.push(instituteIdentifier);
        return true;
      });
      return [...institutesToAdd, ...instituteCollection];
    }
    return instituteCollection;
  }
}
