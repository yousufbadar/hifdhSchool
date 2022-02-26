import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ITracker, Tracker } from '../tracker.model';

import { TrackerService } from './tracker.service';

describe('Tracker Service', () => {
  let service: TrackerService;
  let httpMock: HttpTestingController;
  let elemDefault: ITracker;
  let expectedResult: ITracker | ITracker[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TrackerService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      page: 0,
      word: 0,
      recall: false,
      connect: false,
      tajweed: false,
      makhraj: false,
      createTimestamp: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createTimestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Tracker', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createTimestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createTimestamp: currentDate,
        },
        returnedFromService
      );

      service.create(new Tracker()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tracker', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          page: 1,
          word: 1,
          recall: true,
          connect: true,
          tajweed: true,
          makhraj: true,
          createTimestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createTimestamp: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tracker', () => {
      const patchObject = Object.assign(
        {
          page: 1,
          word: 1,
          recall: true,
          connect: true,
          tajweed: true,
          createTimestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        new Tracker()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createTimestamp: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tracker', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          page: 1,
          word: 1,
          recall: true,
          connect: true,
          tajweed: true,
          makhraj: true,
          createTimestamp: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createTimestamp: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Tracker', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTrackerToCollectionIfMissing', () => {
      it('should add a Tracker to an empty array', () => {
        const tracker: ITracker = { id: 123 };
        expectedResult = service.addTrackerToCollectionIfMissing([], tracker);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tracker);
      });

      it('should not add a Tracker to an array that contains it', () => {
        const tracker: ITracker = { id: 123 };
        const trackerCollection: ITracker[] = [
          {
            ...tracker,
          },
          { id: 456 },
        ];
        expectedResult = service.addTrackerToCollectionIfMissing(trackerCollection, tracker);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tracker to an array that doesn't contain it", () => {
        const tracker: ITracker = { id: 123 };
        const trackerCollection: ITracker[] = [{ id: 456 }];
        expectedResult = service.addTrackerToCollectionIfMissing(trackerCollection, tracker);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tracker);
      });

      it('should add only unique Tracker to an array', () => {
        const trackerArray: ITracker[] = [{ id: 123 }, { id: 456 }, { id: 68056 }];
        const trackerCollection: ITracker[] = [{ id: 123 }];
        expectedResult = service.addTrackerToCollectionIfMissing(trackerCollection, ...trackerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tracker: ITracker = { id: 123 };
        const tracker2: ITracker = { id: 456 };
        expectedResult = service.addTrackerToCollectionIfMissing([], tracker, tracker2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tracker);
        expect(expectedResult).toContain(tracker2);
      });

      it('should accept null and undefined values', () => {
        const tracker: ITracker = { id: 123 };
        expectedResult = service.addTrackerToCollectionIfMissing([], null, tracker, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tracker);
      });

      it('should return initial array if no Tracker is added', () => {
        const trackerCollection: ITracker[] = [{ id: 123 }];
        expectedResult = service.addTrackerToCollectionIfMissing(trackerCollection, undefined, null);
        expect(expectedResult).toEqual(trackerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
