import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IInstitute, Institute } from '../institute.model';
import { InstituteService } from '../service/institute.service';

@Component({
  selector: 'jhi-institute-update',
  templateUrl: './institute-update.component.html',
})
export class InstituteUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    website: [],
    email: [],
    street: [null, [Validators.required]],
    city: [null, [Validators.required]],
    state: [null, [Validators.required]],
    zip: [null, [Validators.required]],
  });

  constructor(protected instituteService: InstituteService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ institute }) => {
      this.updateForm(institute);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const institute = this.createFromForm();
    if (institute.id !== undefined) {
      this.subscribeToSaveResponse(this.instituteService.update(institute));
    } else {
      this.subscribeToSaveResponse(this.instituteService.create(institute));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInstitute>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(institute: IInstitute): void {
    this.editForm.patchValue({
      id: institute.id,
      name: institute.name,
      phone: institute.phone,
      website: institute.website,
      email: institute.email,
      street: institute.street,
      city: institute.city,
      state: institute.state,
      zip: institute.zip,
    });
  }

  protected createFromForm(): IInstitute {
    return {
      ...new Institute(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      phone: this.editForm.get(['phone'])!.value,
      website: this.editForm.get(['website'])!.value,
      email: this.editForm.get(['email'])!.value,
      street: this.editForm.get(['street'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      zip: this.editForm.get(['zip'])!.value,
    };
  }
}
