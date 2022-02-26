import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IStudent, Student } from '../student.model';
import { StudentService } from '../service/student.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IInstitute } from 'app/entities/institute/institute.model';
import { InstituteService } from 'app/entities/institute/service/institute.service';

@Component({
  selector: 'jhi-student-update',
  templateUrl: './student-update.component.html',
})
export class StudentUpdateComponent implements OnInit {
  isSaving = false;

  institutesSharedCollection: IInstitute[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [null, [Validators.required]],
    middleName: [],
    lastName: [null, [Validators.required]],
    likeToBeCalled: [],
    birthDate: [null, [Validators.required]],
    photo: [],
    photoContentType: [],
    cellPhone: [null, [Validators.required]],
    homePhone: [],
    email: [],
    street: [null, [Validators.required]],
    city: [null, [Validators.required]],
    state: [null, [Validators.required]],
    zip: [null, [Validators.required]],
    institute: [null, Validators.required],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected studentService: StudentService,
    protected instituteService: InstituteService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ student }) => {
      this.updateForm(student);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('hifdhSchoolApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const student = this.createFromForm();
    if (student.id !== undefined) {
      this.subscribeToSaveResponse(this.studentService.update(student));
    } else {
      this.subscribeToSaveResponse(this.studentService.create(student));
    }
  }

  trackInstituteById(index: number, item: IInstitute): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudent>>): void {
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

  protected updateForm(student: IStudent): void {
    this.editForm.patchValue({
      id: student.id,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      likeToBeCalled: student.likeToBeCalled,
      birthDate: student.birthDate,
      photo: student.photo,
      photoContentType: student.photoContentType,
      cellPhone: student.cellPhone,
      homePhone: student.homePhone,
      email: student.email,
      street: student.street,
      city: student.city,
      state: student.state,
      zip: student.zip,
      institute: student.institute,
    });

    this.institutesSharedCollection = this.instituteService.addInstituteToCollectionIfMissing(
      this.institutesSharedCollection,
      student.institute
    );
  }

  protected loadRelationshipsOptions(): void {
    this.instituteService
      .query()
      .pipe(map((res: HttpResponse<IInstitute[]>) => res.body ?? []))
      .pipe(
        map((institutes: IInstitute[]) =>
          this.instituteService.addInstituteToCollectionIfMissing(institutes, this.editForm.get('institute')!.value)
        )
      )
      .subscribe((institutes: IInstitute[]) => (this.institutesSharedCollection = institutes));
  }

  protected createFromForm(): IStudent {
    return {
      ...new Student(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      middleName: this.editForm.get(['middleName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      likeToBeCalled: this.editForm.get(['likeToBeCalled'])!.value,
      birthDate: this.editForm.get(['birthDate'])!.value,
      photoContentType: this.editForm.get(['photoContentType'])!.value,
      photo: this.editForm.get(['photo'])!.value,
      cellPhone: this.editForm.get(['cellPhone'])!.value,
      homePhone: this.editForm.get(['homePhone'])!.value,
      email: this.editForm.get(['email'])!.value,
      street: this.editForm.get(['street'])!.value,
      city: this.editForm.get(['city'])!.value,
      state: this.editForm.get(['state'])!.value,
      zip: this.editForm.get(['zip'])!.value,
      institute: this.editForm.get(['institute'])!.value,
    };
  }
}
