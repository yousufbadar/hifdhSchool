import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InstituteComponent } from './list/institute.component';
import { InstituteDetailComponent } from './detail/institute-detail.component';
import { InstituteUpdateComponent } from './update/institute-update.component';
import { InstituteDeleteDialogComponent } from './delete/institute-delete-dialog.component';
import { InstituteRoutingModule } from './route/institute-routing.module';

@NgModule({
  imports: [SharedModule, InstituteRoutingModule],
  declarations: [InstituteComponent, InstituteDetailComponent, InstituteUpdateComponent, InstituteDeleteDialogComponent],
  entryComponents: [InstituteDeleteDialogComponent],
})
export class InstituteModule {}
