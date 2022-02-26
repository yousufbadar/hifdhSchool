import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TeacherService } from '../service/teacher.service';
import { ITeacher, Teacher } from '../teacher.model';
import { IInstitute } from 'app/entities/institute/institute.model';
import { InstituteService } from 'app/entities/institute/service/institute.service';

import { TeacherUpdateComponent } from './teacher-update.component';

describe('Teacher Management Update Component', () => {
  let comp: TeacherUpdateComponent;
  let fixture: ComponentFixture<TeacherUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let teacherService: TeacherService;
  let instituteService: InstituteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TeacherUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(TeacherUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TeacherUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    teacherService = TestBed.inject(TeacherService);
    instituteService = TestBed.inject(InstituteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Institute query and add missing value', () => {
      const teacher: ITeacher = { id: 456 };
      const institute: IInstitute = { id: 63646 };
      teacher.institute = institute;

      const instituteCollection: IInstitute[] = [{ id: 24711 }];
      jest.spyOn(instituteService, 'query').mockReturnValue(of(new HttpResponse({ body: instituteCollection })));
      const additionalInstitutes = [institute];
      const expectedCollection: IInstitute[] = [...additionalInstitutes, ...instituteCollection];
      jest.spyOn(instituteService, 'addInstituteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ teacher });
      comp.ngOnInit();

      expect(instituteService.query).toHaveBeenCalled();
      expect(instituteService.addInstituteToCollectionIfMissing).toHaveBeenCalledWith(instituteCollection, ...additionalInstitutes);
      expect(comp.institutesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const teacher: ITeacher = { id: 456 };
      const institute: IInstitute = { id: 9424 };
      teacher.institute = institute;

      activatedRoute.data = of({ teacher });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(teacher));
      expect(comp.institutesSharedCollection).toContain(institute);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Teacher>>();
      const teacher = { id: 123 };
      jest.spyOn(teacherService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teacher });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: teacher }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(teacherService.update).toHaveBeenCalledWith(teacher);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Teacher>>();
      const teacher = new Teacher();
      jest.spyOn(teacherService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teacher });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: teacher }));
      saveSubject.complete();

      // THEN
      expect(teacherService.create).toHaveBeenCalledWith(teacher);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Teacher>>();
      const teacher = { id: 123 };
      jest.spyOn(teacherService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ teacher });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(teacherService.update).toHaveBeenCalledWith(teacher);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackInstituteById', () => {
      it('Should return tracked Institute primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackInstituteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
