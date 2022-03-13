import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';
import { PageDetails } from './pageDetails';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrackerService } from 'app/entities/tracker/service/tracker.service';

@Component({
  selector: 'jhi-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [PageDetails],
})
export class HomeComponent implements OnInit, OnDestroy {
  account: Account | null = null;
  currentPage: any = 1;
  page: any = 1;
  surahs: any;

  authSubscription: Subscription | null = null;
  modalRef: NgbModalRef | null = null;
  pages: any;
  word: any;
  currentSurah: any = 1;
  pageMessage: string | null = null;
  pageWordClicked = 0;
  clickedWord = 0;
  isSaving: boolean | null = null;
  tsNow = new Date();

  private readonly destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private trackerService: TrackerService,
    private pageDetails: PageDetails
  ) {}

  ngOnInit(): void {
    this.surahs = this.pageDetails.getSurahDetails();
    this.currentPage = 'p001';

    this.pages = this.pageDetails.getPageDetails();
    this.surahs = this.pageDetails.getSurahDetails();
    /*  this.accountService.identity().subscribe((account: Account) => {
      this.account = account;
    }); */

    this.showHide(0);
    this.highLightMarkers();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(account => (this.account = account));
  }

  showHide(sel: number): void {
    const page = this.pages[sel];
    this.pageMessage = String(sel);
    const charcount = page.charCount;
    const bismils = page.bismil;
    this.page = page.page;
    this.pageMessage = bismils;
    for (let r = 0; r < 6; r++) {
      const removes = document.getElementById('bisDiv');
      if (removes != null) {
        removes.parentNode!.removeChild(removes);
      }
    }
    this.addBismils(bismils);
    for (let i = 1; i < 195; i++) {
      const id = String(i);
      document.getElementById(id)!.classList.value = '';
      // this.pageMessage = document.getElementById(id)! + ' ' + id;
      if (i <= charcount) {
        document.getElementById(id)!.style.visibility = 'visible';
      } else {
        document.getElementById(id)!.style.visibility = 'hidden';
      }
    }
  }

  highLightMarkers(): void {
    this.trackerService.findByPage(this.page).subscribe(data => {
      const tracks = data.body as any[];
      tracks.forEach(track => {
        const colorWord = track.word;
        if (track.recall === true) {
          document.getElementById(colorWord)!.classList.value = 'four';
        } else if (track.connect === true) {
          document.getElementById(colorWord)!.classList.value = 'three';
        } else if (track.tajweed === true) {
          document.getElementById(colorWord)!.classList.value = 'two';
        } else if (track.makhraj === true) {
          document.getElementById(colorWord)!.classList.value = 'one';
        } else {
          document.getElementById(colorWord)!.classList.value = '';
        }
      });
    });
  }

  addBismils(bismils: []): void {
    for (let i = 1; i < 195; i++) {
      for (const b in bismils) {
        //  const bsml = parseInt(bismils[b]);
        if (parseInt(bismils[b], 10) + 1 === i) {
          const spanid = parseInt(bismils[b], 10) + 1;
          // console.log(spanid);
          const bPoint = document.getElementById(String(spanid)) as HTMLInputElement;
          const bismil = document.createElement('p');
          bismil.setAttribute('id', 'bisDiv');
          bismil.innerHTML =
            '<div id="bismil" style="text-align: center; width=100%"><hr><span class="bismil" style="text-align: right;">№ий</span></div>';
          bPoint.insertAdjacentElement('beforebegin', bismil);
        }
      }
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  save(thisvalue: number): void {
    console.log(thisvalue);
    window.getSelection()!.removeAllRanges();
  }

  next(): void {
    window.getSelection()!.removeAllRanges();
  }

  previous(): void {
    window.getSelection()!.removeAllRanges();
  }

  onSurahChange(thisvalue: number): void {
    this.currentPage = 10;
    this.page = thisvalue;
  }

  onPageChange(thisvalue: number): void {
    this.currentPage = 11;
    this.page = thisvalue;
  }
}
