import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStudent, Student } from '../student.model';

import { StudentService } from './student.service';

describe('Student Service', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;
  let elemDefault: IStudent;
  let expectedResult: IStudent | IStudent[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StudentService);
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

    it('should create a Student', () => {
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

      service.create(new Student()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Student', () => {
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

    it('should partial update a Student', () => {
      const patchObject = Object.assign(
        {
          firstName: 'BBBBBB',
          birthDate: currentDate.format(DATE_FORMAT),
          photo: 'BBBBBB',
          street: 'BBBBBB',
          state: 'BBBBBB',
        },
        new Student()
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

    it('should return a list of Student', () => {
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

    it('should delete a Student', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addStudentToCollectionIfMissing', () => {
      it('should add a Student to an empty array', () => {
        const student: IStudent = { id: 123 };
        expectedResult = service.addStudentToCollectionIfMissing([], student);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(student);
      });

      it('should not add a Student to an array that contains it', () => {
        const student: IStudent = { id: 123 };
        const studentCollection: IStudent[] = [
          {
            ...student,
          },
          { id: 456 },
        ];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, student);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Student to an array that doesn't contain it", () => {
        const student: IStudent = { id: 123 };
        const studentCollection: IStudent[] = [{ id: 456 }];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, student);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(student);
      });

      it('should add only unique Student to an array', () => {
        const studentArray: IStudent[] = [{ id: 123 }, { id: 456 }, { id: 82290 }];
        const studentCollection: IStudent[] = [{ id: 123 }];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, ...studentArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const student: IStudent = { id: 123 };
        const student2: IStudent = { id: 456 };
        expectedResult = service.addStudentToCollectionIfMissing([], student, student2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(student);
        expect(expectedResult).toContain(student2);
      });

      it('should accept null and undefined values', () => {
        const student: IStudent = { id: 123 };
        expectedResult = service.addStudentToCollectionIfMissing([], null, student, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(student);
      });

      it('should return initial array if no Student is added', () => {
        const studentCollection: IStudent[] = [{ id: 123 }];
        expectedResult = service.addStudentToCollectionIfMissing(studentCollection, undefined, null);
        expect(expectedResult).toEqual(studentCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
