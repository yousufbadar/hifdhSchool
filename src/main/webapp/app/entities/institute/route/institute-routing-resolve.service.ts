import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInstitute, Institute } from '../institute.model';
import { InstituteService } from '../service/institute.service';

@Injectable({ providedIn: 'root' })
export class InstituteRoutingResolveService implements Resolve<IInstitute> {
  constructor(protected service: InstituteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInstitute> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((institute: HttpResponse<Institute>) => {
          if (institute.body) {
            return of(institute.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Institute());
  }
}
