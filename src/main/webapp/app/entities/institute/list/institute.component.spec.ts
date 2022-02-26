import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { InstituteService } from '../service/institute.service';

import { InstituteComponent } from './institute.component';

describe('Institute Management Component', () => {
  let comp: InstituteComponent;
  let fixture: ComponentFixture<InstituteComponent>;
  let service: InstituteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [InstituteComponent],
    })
      .overrideTemplate(InstituteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InstituteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(InstituteService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.institutes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
