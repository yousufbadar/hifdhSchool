import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITracker } from '../tracker.model';

@Component({
  selector: 'jhi-tracker-detail',
  templateUrl: './tracker-detail.component.html',
})
export class TrackerDetailComponent implements OnInit {
  tracker: ITracker | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tracker }) => {
      this.tracker = tracker;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
