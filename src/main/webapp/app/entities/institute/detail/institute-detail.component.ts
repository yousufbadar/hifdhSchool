import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInstitute } from '../institute.model';

@Component({
  selector: 'jhi-institute-detail',
  templateUrl: './institute-detail.component.html',
})
export class InstituteDetailComponent implements OnInit {
  institute: IInstitute | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ institute }) => {
      this.institute = institute;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
