import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-location-map-dialog',
  template: `
    <div class="map-dialog-container">
      <div id="map" class="mapbox-map"></div>
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
  private map!: mapboxgl.Map;
  private marker!: mapboxgl.Marker;

  selectedCoords = { lat: 36.8065, lng: 10.1815 }; // Default: Tunis

  constructor(
    public dialogRef: MatDialogRef<LocationMapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    // ✅ Configure your Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG91c3NlbTEyMzQiLCJhIjoiY21hNWhxbGF3MGhzczJpc2dieTRqbWczbSJ9.WB_CdzlMnLXexWtQfyRQaA';
  }

  ngAfterViewInit(): void {
    // ✅ Initialize the map
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.selectedCoords.lng, this.selectedCoords.lat],
      zoom: 13,
      dragRotate: false,
      touchZoomRotate: true
    });

    // ✅ Add a draggable marker
    this.marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([this.selectedCoords.lng, this.selectedCoords.lat])
      .addTo(this.map);

    this.marker.on('dragend', () => {
      const lngLat = this.marker.getLngLat();
      this.selectedCoords = { lat: lngLat.lat, lng: lngLat.lng };
    });

    // ✅ Fix display issues after dialog opens
    setTimeout(() => {
      this.map.resize();
      this.map.setCenter([this.selectedCoords.lng, this.selectedCoords.lat]); // ✅ Recentrer manuellement
    }, 300);
    
  }

  confirmLocation(): void {
    this.dialogRef.close(this.selectedCoords);
  }
}
