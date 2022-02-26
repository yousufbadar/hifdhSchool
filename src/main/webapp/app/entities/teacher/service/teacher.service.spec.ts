import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITeacher, Teacher } from '../teacher.model';

import { TeacherService } from './teacher.service';

describe('Teacher Service', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;
  let elemDefault: ITeacher;
  let expectedResult: ITeacher | ITeacher[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      firstName: 'AAAAAAA',
      middleName: 'AAAAAAA',
      lastName: 'AAAAAAA',
      likeToBeCalled: 'AAAAAAA',
      birthDate: currentDate,
      photoContentType: 'image/png',
      photo: 'AAAAAAA',
      cellPhone: 'AAAAAAA',
      homePhone: 'AAAAAAA',
      email: 'AAAAAAA',
      street: 'AAAAAAA',
      city: 'AAAAAAA',
      state: 'AAAAAAA',
      zip: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          birthDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Teacher', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          birthDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.create(new Teacher()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Teacher', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          middleName: 'BBBBBB',
          lastName: 'BBBBBB',
          likeToBeCalled: 'BBBBBB',
          birthDate: currentDate.format(DATE_FORMAT),
          photo: 'BBBBBB',
          cellPhone: 'BBBBBB',
          homePhone: 'BBBBBB',
          email: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zip: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Teacher', () => {
      const patchObject = Object.assign(
        {
          photo: 'BBBBBB',
          homePhone: 'BBBBBB',
          email: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zip: 'BBBBBB',
        },
        new Teacher()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Teacher', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          firstName: 'BBBBBB',
          middleName: 'BBBBBB',
          lastName: 'BBBBBB',
          likeToBeCalled: 'BBBBBB',
          birthDate: currentDate.format(DATE_FORMAT),
          photo: 'BBBBBB',
          cellPhone: 'BBBBBB',
          homePhone: 'BBBBBB',
          email: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zip: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          birthDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Teacher', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTeacherToCollectionIfMissing', () => {
      it('should add a Teacher to an empty array', () => {
        const teacher: ITeacher = { id: 123 };
        expectedResult = service.addTeacherToCollectionIfMissing([], teacher);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(teacher);
      });

      it('should not add a Teacher to an array that contains it', () => {
        const teacher: ITeacher = { id: 123 };
        const teacherCollection: ITeacher[] = [
          {
            ...teacher,
          },
          { id: 456 },
        ];
        expectedResult = service.addTeacherToCollectionIfMissing(teacherCollection, teacher);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Teacher to an array that doesn't contain it", () => {
        const teacher: ITeacher = { id: 123 };
        const teacherCollection: ITeacher[] = [{ id: 456 }];
        expectedResult = service.addTeacherToCollectionIfMissing(teacherCollection, teacher);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(teacher);
      });

      it('should add only unique Teacher to an array', () => {
        const teacherArray: ITeacher[] = [{ id: 123 }, { id: 456 }, { id: 30780 }];
        const teacherCollection: ITeacher[] = [{ id: 123 }];
        expectedResult = service.addTeacherToCollectionIfMissing(teacherCollection, ...teacherArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const teacher: ITeacher = { id: 123 };
        const teacher2: ITeacher = { id: 456 };
        expectedResult = service.addTeacherToCollectionIfMissing([], teacher, teacher2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(teacher);
        expect(expectedResult).toContain(teacher2);
      });

      it('should accept null and undefined values', () => {
        const teacher: ITeacher = { id: 123 };
        expectedResult = service.addTeacherToCollectionIfMissing([], null, teacher, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(teacher);
      });

      it('should return initial array if no Teacher is added', () => {
        const teacherCollection: ITeacher[] = [{ id: 123 }];
        expectedResult = service.addTeacherToCollectionIfMissing(teacherCollection, undefined, null);
        expect(expectedResult).toEqual(teacherCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
