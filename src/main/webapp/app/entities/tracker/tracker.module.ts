import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrackerComponent } from './list/tracker.component';
import { TrackerDetailComponent } from './detail/tracker-detail.component';
import { TrackerUpdateComponent } from './update/tracker-update.component';
import { TrackerDeleteDialogComponent } from './delete/tracker-delete-dialog.component';
import { TrackerRoutingModule } from './route/tracker-routing.module';

@NgModule({
  imports: [SharedModule, TrackerRoutingModule],
  declarations: [TrackerComponent, TrackerDetailComponent, TrackerUpdateComponent, TrackerDeleteDialogComponent],
  entryComponents: [TrackerDeleteDialogComponent],
})
export class TrackerModule {}
