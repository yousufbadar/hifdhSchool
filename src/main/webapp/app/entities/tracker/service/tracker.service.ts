import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITracker, getTrackerIdentifier } from '../tracker.model';

export type EntityResponseType = HttpResponse<ITracker>;
export type EntityArrayResponseType = HttpResponse<ITracker[]>;

@Injectable({ providedIn: 'root' })
export class TrackerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trackers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  findByPage(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITracker>(`${this.resourceUrl}/page/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  create(tracker: ITracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tracker);
    return this.http
      .post<ITracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tracker: ITracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tracker);
    return this.http
      .put<ITracker>(`${this.resourceUrl}/${getTrackerIdentifier(tracker) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(tracker: ITracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tracker);
    return this.http
      .patch<ITracker>(`${this.resourceUrl}/${getTrackerIdentifier(tracker) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTrackerToCollectionIfMissing(trackerCollection: ITracker[], ...trackersToCheck: (ITracker | null | undefined)[]): ITracker[] {
    const trackers: ITracker[] = trackersToCheck.filter(isPresent);
    if (trackers.length > 0) {
      const trackerCollectionIdentifiers = trackerCollection.map(trackerItem => getTrackerIdentifier(trackerItem)!);
      const trackersToAdd = trackers.filter(trackerItem => {
        const trackerIdentifier = getTrackerIdentifier(trackerItem);
        if (trackerIdentifier == null || trackerCollectionIdentifiers.includes(trackerIdentifier)) {
          return false;
        }
        trackerCollectionIdentifiers.push(trackerIdentifier);
        return true;
      });
      return [...trackersToAdd, ...trackerCollection];
    }
    return trackerCollection;
  }

  protected convertDateFromClient(tracker: ITracker): ITracker {
    return Object.assign({}, tracker, {
      createTimestamp: tracker.createTimestamp?.isValid() ? tracker.createTimestamp.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createTimestamp = res.body.createTimestamp ? dayjs(res.body.createTimestamp) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tracker: ITracker) => {
        tracker.createTimestamp = tracker.createTimestamp ? dayjs(tracker.createTimestamp) : undefined;
      });
    }
    return res;
  }
}
