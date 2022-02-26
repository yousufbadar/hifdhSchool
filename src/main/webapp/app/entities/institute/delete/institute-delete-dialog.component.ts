import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInstitute } from '../institute.model';
import { InstituteService } from '../service/institute.service';

@Component({
  templateUrl: './institute-delete-dialog.component.html',
})
export class InstituteDeleteDialogComponent {
  institute?: IInstitute;

  constructor(protected instituteService: InstituteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.instituteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
