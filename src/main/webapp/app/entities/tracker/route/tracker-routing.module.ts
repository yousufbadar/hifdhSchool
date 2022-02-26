import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrackerComponent } from '../list/tracker.component';
import { TrackerDetailComponent } from '../detail/tracker-detail.component';
import { TrackerUpdateComponent } from '../update/tracker-update.component';
import { TrackerRoutingResolveService } from './tracker-routing-resolve.service';

const trackerRoute: Routes = [
  {
    path: '',
    component: TrackerComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrackerDetailComponent,
    resolve: {
      tracker: TrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrackerUpdateComponent,
    resolve: {
      tracker: TrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrackerUpdateComponent,
    resolve: {
      tracker: TrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trackerRoute)],
  exports: [RouterModule],
})
export class TrackerRoutingModule {}
