import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IInstitute } from '../institute.model';
import { InstituteService } from '../service/institute.service';
import { InstituteDeleteDialogComponent } from '../delete/institute-delete-dialog.component';

@Component({
  selector: 'jhi-institute',
  templateUrl: './institute.component.html',
})
export class InstituteComponent implements OnInit {
  institutes?: IInstitute[];
  isLoading = false;

  constructor(protected instituteService: InstituteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.instituteService.query().subscribe({
      next: (res: HttpResponse<IInstitute[]>) => {
        this.isLoading = false;
        this.institutes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IInstitute): number {
    return item.id!;
  }

  delete(institute: IInstitute): void {
    const modalRef = this.modalService.open(InstituteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.institute = institute;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
