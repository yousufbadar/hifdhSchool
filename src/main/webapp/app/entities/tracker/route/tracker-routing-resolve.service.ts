import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITracker, Tracker } from '../tracker.model';
import { TrackerService } from '../service/tracker.service';

@Injectable({ providedIn: 'root' })
export class TrackerRoutingResolveService implements Resolve<ITracker> {
  constructor(protected service: TrackerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITracker> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tracker: HttpResponse<Tracker>) => {
          if (tracker.body) {
            return of(tracker.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tracker());
  }
}
