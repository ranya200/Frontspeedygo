import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';

@Component({
  selector: 'app-location-map-dialog',
  template: `
    <div class="map-dialog-container">
      <div id="map" class="leaflet-map"></div>
      <div class="text-end mt-3">
        <button class="btn btn-primary" (click)="confirmLocation()">✅ Confirm Location</button>
      </div>
    </div>
  `,
  styles: [`
    .map-dialog-container {
      width: 100%;
      height: 100%;
      padding: 10px;
    }

    #map {
      width: 100%;
      height: 500px;
      border-radius: 8px;
    }
  `],
  standalone: true,
  imports: []
})
export class LocationMapDialogComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private marker!: L.Marker;
  private selectedCoords: { lat: number, lng: number } = {
    lat: 36.8065,
    lng: 10.1815
  }; // Default: Tunis

  constructor(
    public dialogRef: MatDialogRef<LocationMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.map = L.map('map', {
        attributionControl: false
      }).setView([this.selectedCoords.lat, this.selectedCoords.lng], 13);
  
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(this.map);
  
      this.marker = L.marker(this.selectedCoords, {
        draggable: true
      }).addTo(this.map);
  
      this.marker.on('dragend', () => {
        const pos = this.marker.getLatLng();
        this.selectedCoords = { lat: pos.lat, lng: pos.lng };
      });
  
      // 🔁 Ensure rendering after dialog opens
      setTimeout(() => {
        this.map.invalidateSize();
      }, 300);
    }, 0); // ensure DOM is ready
  }
  

  confirmLocation() {
    this.dialogRef.close(this.selectedCoords);
  }
}
