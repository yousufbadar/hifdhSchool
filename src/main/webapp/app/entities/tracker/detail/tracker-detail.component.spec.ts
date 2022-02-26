import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrackerDetailComponent } from './tracker-detail.component';

describe('Tracker Management Detail Component', () => {
  let comp: TrackerDetailComponent;
  let fixture: ComponentFixture<TrackerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrackerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ tracker: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TrackerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TrackerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load tracker on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.tracker).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
