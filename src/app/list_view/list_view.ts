import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FirebaseService, Marker } from '../services/firebase_service';
import { iconColorMap } from '../services/marker_icon';

@Component({
  selector: 'list-view',
  templateUrl: 'list_view.html',
  styleUrls: ['./list_view.scss'],
})
export class ListViewComponent implements OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef;

  readonly iconColorMap = iconColorMap;

  isFilterCardOpen = false;
  categories = ['Hike', 'Food', 'Accommodation'];

  private readonly destroyed = new ReplaySubject<void>(1);

  constructor(readonly firebaseService: FirebaseService) {
    this.firebaseService.drawerOpenSubject
      .pipe(takeUntil(this.destroyed))
      .subscribe((isOpen: boolean) => {
        if (isOpen) {
          this.focusOnSearchBox();
        }
      });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  focusOnSearchBox() {
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
    }, 0);
  }

  drawerOpen() {
    this.firebaseService.drawerOpenSubject.next(false);
  }

  openSpotInfo(marker: Marker) {
    if (this.firebaseService.selectedSpotId === marker.spotId) {
      this.firebaseService.openSpotInfoDialog(marker);
    }
    this.firebaseService.selectedSpotId = marker.spotId;
    this.firebaseService.panTo({ lat: marker.position.lat, lng: marker.position.lng });
  }

  openFilterCard() {
    this.isFilterCardOpen = !this.isFilterCardOpen;
    // if (this.isFilterCardOpen) {
    //   this.filterText = '';
    //   this.filterMarkers();
    // }
  }
}
