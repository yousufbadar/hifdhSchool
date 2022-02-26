import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InstituteComponent } from '../list/institute.component';
import { InstituteDetailComponent } from '../detail/institute-detail.component';
import { InstituteUpdateComponent } from '../update/institute-update.component';
import { InstituteRoutingResolveService } from './institute-routing-resolve.service';

const instituteRoute: Routes = [
  {
    path: '',
    component: InstituteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InstituteDetailComponent,
    resolve: {
      institute: InstituteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InstituteUpdateComponent,
    resolve: {
      institute: InstituteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InstituteUpdateComponent,
    resolve: {
      institute: InstituteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(instituteRoute)],
  exports: [RouterModule],
})
export class InstituteRoutingModule {}
