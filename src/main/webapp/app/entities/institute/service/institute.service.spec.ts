import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInstitute, Institute } from '../institute.model';

import { InstituteService } from './institute.service';

describe('Institute Service', () => {
  let service: InstituteService;
  let httpMock: HttpTestingController;
  let elemDefault: IInstitute;
  let expectedResult: IInstitute | IInstitute[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InstituteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      phone: 'AAAAAAA',
      website: 'AAAAAAA',
      email: 'AAAAAAA',
      street: 'AAAAAAA',
      city: 'AAAAAAA',
      state: 'AAAAAAA',
      zip: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Institute', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Institute()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Institute', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          phone: 'BBBBBB',
          website: 'BBBBBB',
          email: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zip: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Institute', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          website: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
        },
        new Institute()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Institute', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          phone: 'BBBBBB',
          website: 'BBBBBB',
          email: 'BBBBBB',
          street: 'BBBBBB',
          city: 'BBBBBB',
          state: 'BBBBBB',
          zip: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Institute', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addInstituteToCollectionIfMissing', () => {
      it('should add a Institute to an empty array', () => {
        const institute: IInstitute = { id: 123 };
        expectedResult = service.addInstituteToCollectionIfMissing([], institute);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(institute);
      });

      it('should not add a Institute to an array that contains it', () => {
        const institute: IInstitute = { id: 123 };
        const instituteCollection: IInstitute[] = [
          {
            ...institute,
          },
          { id: 456 },
        ];
        expectedResult = service.addInstituteToCollectionIfMissing(instituteCollection, institute);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Institute to an array that doesn't contain it", () => {
        const institute: IInstitute = { id: 123 };
        const instituteCollection: IInstitute[] = [{ id: 456 }];
        expectedResult = service.addInstituteToCollectionIfMissing(instituteCollection, institute);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(institute);
      });

      it('should add only unique Institute to an array', () => {
        const instituteArray: IInstitute[] = [{ id: 123 }, { id: 456 }, { id: 53735 }];
        const instituteCollection: IInstitute[] = [{ id: 123 }];
        expectedResult = service.addInstituteToCollectionIfMissing(instituteCollection, ...instituteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const institute: IInstitute = { id: 123 };
        const institute2: IInstitute = { id: 456 };
        expectedResult = service.addInstituteToCollectionIfMissing([], institute, institute2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(institute);
        expect(expectedResult).toContain(institute2);
      });

      it('should accept null and undefined values', () => {
        const institute: IInstitute = { id: 123 };
        expectedResult = service.addInstituteToCollectionIfMissing([], null, institute, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(institute);
      });

      it('should return initial array if no Institute is added', () => {
        const instituteCollection: IInstitute[] = [{ id: 123 }];
        expectedResult = service.addInstituteToCollectionIfMissing(instituteCollection, undefined, null);
        expect(expectedResult).toEqual(instituteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
