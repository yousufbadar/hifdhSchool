import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITracker } from '../tracker.model';
import { TrackerService } from '../service/tracker.service';

@Component({
  templateUrl: './tracker-delete-dialog.component.html',
})
export class TrackerDeleteDialogComponent {
  tracker?: ITracker;

  constructor(protected trackerService: TrackerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.trackerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
