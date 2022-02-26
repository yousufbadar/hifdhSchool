import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITeacher, Teacher } from '../teacher.model';
import { TeacherService } from '../service/teacher.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IInstitute } from 'app/entities/institute/institute.model';
import { InstituteService } from 'app/entities/institute/service/institute.service';

@Component({
  selector: 'jhi-teacher-update',
  templateUrl: './teacher-update.component.html',
})
export class TeacherUpdateComponent implements OnInit {
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
    protected teacherService: TeacherService,
    protected instituteService: InstituteService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ teacher }) => {
      this.updateForm(teacher);

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
    const teacher = this.createFromForm();
    if (teacher.id !== undefined) {
      this.subscribeToSaveResponse(this.teacherService.update(teacher));
    } else {
      this.subscribeToSaveResponse(this.teacherService.create(teacher));
    }
  }

  trackInstituteById(index: number, item: IInstitute): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITeacher>>): void {
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

  protected updateForm(teacher: ITeacher): void {
    this.editForm.patchValue({
      id: teacher.id,
      firstName: teacher.firstName,
      middleName: teacher.middleName,
      lastName: teacher.lastName,
      likeToBeCalled: teacher.likeToBeCalled,
      birthDate: teacher.birthDate,
      photo: teacher.photo,
      photoContentType: teacher.photoContentType,
      cellPhone: teacher.cellPhone,
      homePhone: teacher.homePhone,
      email: teacher.email,
      street: teacher.street,
      city: teacher.city,
      state: teacher.state,
      zip: teacher.zip,
      institute: teacher.institute,
    });

    this.institutesSharedCollection = this.instituteService.addInstituteToCollectionIfMissing(
      this.institutesSharedCollection,
      teacher.institute
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

  protected createFromForm(): ITeacher {
    return {
      ...new Teacher(),
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
