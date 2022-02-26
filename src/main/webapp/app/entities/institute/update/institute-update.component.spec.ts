import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InstituteService } from '../service/institute.service';
import { IInstitute, Institute } from '../institute.model';

import { InstituteUpdateComponent } from './institute-update.component';

describe('Institute Management Update Component', () => {
  let comp: InstituteUpdateComponent;
  let fixture: ComponentFixture<InstituteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let instituteService: InstituteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InstituteUpdateComponent],
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
      .overrideTemplate(InstituteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstituteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    instituteService = TestBed.inject(InstituteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const institute: IInstitute = { id: 456 };

      activatedRoute.data = of({ institute });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(institute));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Institute>>();
      const institute = { id: 123 };
      jest.spyOn(instituteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: institute }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(instituteService.update).toHaveBeenCalledWith(institute);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Institute>>();
      const institute = new Institute();
      jest.spyOn(instituteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: institute }));
      saveSubject.complete();

      // THEN
      expect(instituteService.create).toHaveBeenCalledWith(institute);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Institute>>();
      const institute = { id: 123 };
      jest.spyOn(instituteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ institute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(instituteService.update).toHaveBeenCalledWith(institute);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
