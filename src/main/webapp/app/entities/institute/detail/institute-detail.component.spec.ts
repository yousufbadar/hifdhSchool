import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InstituteDetailComponent } from './institute-detail.component';

describe('Institute Management Detail Component', () => {
  let comp: InstituteDetailComponent;
  let fixture: ComponentFixture<InstituteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstituteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ institute: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InstituteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InstituteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load institute on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.institute).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
