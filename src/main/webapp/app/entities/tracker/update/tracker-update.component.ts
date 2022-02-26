import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ITracker, Tracker } from '../tracker.model';
import { TrackerService } from '../service/tracker.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';

@Component({
  selector: 'jhi-tracker-update',
  templateUrl: './tracker-update.component.html',
})
export class TrackerUpdateComponent implements OnInit {
  isSaving = false;

  studentsSharedCollection: IStudent[] = [];

  editForm = this.fb.group({
    id: [],
    page: [],
    word: [],
    recall: [],
    connect: [],
    tajweed: [],
    makhraj: [],
    createTimestamp: [null, [Validators.required]],
    student: [],
  });

  constructor(
    protected trackerService: TrackerService,
    protected studentService: StudentService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tracker }) => {
      if (tracker.id === undefined) {
        const today = dayjs().startOf('day');
        tracker.createTimestamp = today;
      }

      this.updateForm(tracker);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tracker = this.createFromForm();
    if (tracker.id !== undefined) {
      this.subscribeToSaveResponse(this.trackerService.update(tracker));
    } else {
      this.subscribeToSaveResponse(this.trackerService.create(tracker));
    }
  }

  trackStudentById(index: number, item: IStudent): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITracker>>): void {
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

  protected updateForm(tracker: ITracker): void {
    this.editForm.patchValue({
      id: tracker.id,
      page: tracker.page,
      word: tracker.word,
      recall: tracker.recall,
      connect: tracker.connect,
      tajweed: tracker.tajweed,
      makhraj: tracker.makhraj,
      createTimestamp: tracker.createTimestamp ? tracker.createTimestamp.format(DATE_TIME_FORMAT) : null,
      student: tracker.student,
    });

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing(this.studentsSharedCollection, tracker.student);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(
        map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing(students, this.editForm.get('student')!.value))
      )
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));
  }

  protected createFromForm(): ITracker {
    return {
      ...new Tracker(),
      id: this.editForm.get(['id'])!.value,
      page: this.editForm.get(['page'])!.value,
      word: this.editForm.get(['word'])!.value,
      recall: this.editForm.get(['recall'])!.value,
      connect: this.editForm.get(['connect'])!.value,
      tajweed: this.editForm.get(['tajweed'])!.value,
      makhraj: this.editForm.get(['makhraj'])!.value,
      createTimestamp: this.editForm.get(['createTimestamp'])!.value
        ? dayjs(this.editForm.get(['createTimestamp'])!.value, DATE_TIME_FORMAT)
        : undefined,
      student: this.editForm.get(['student'])!.value,
    };
  }
}
