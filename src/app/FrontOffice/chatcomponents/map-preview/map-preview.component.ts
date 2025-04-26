import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-preview',
  standalone: true,
  imports: [CommonModule, LeafletModule, MatDialogModule],
  templateUrl: './map-preview.component.html',
  styleUrl: './map-preview.component.css'
})
export class MapPreviewComponent implements OnInit {
  selectedLat: number = 36.8;
  selectedLng: number = 10.2;

  private map!: L.Map;
  private marker!: L.Marker;

  constructor(
    public dialogRef: MatDialogRef<MapPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  private initMap(): void {
    this.map = L.map('map').setView([this.selectedLat, this.selectedLng], 13);
    setTimeout(() => this.map.invalidateSize(), 200);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: 'OpenStreetMap contributors'
    }).addTo(this.map);

    this.marker = L.marker([this.selectedLat, this.selectedLng], {
      draggable: true,
      icon: L.icon({
        iconUrl: 'assets/map-icons/marker-icon.png',
        iconRetinaUrl: 'assets/map-icons/marker-icon-2x.png',
        shadowUrl: 'assets/map-icons/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        shadowSize: [41, 41]
      })
    }).addTo(this.map);

    this.marker.on('dragend', () => {
      const position = this.marker.getLatLng();
      this.selectedLat = position.lat;
      this.selectedLng = position.lng;
    });

    this.map.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      this.selectedLat = lat;
      this.selectedLng = lng;
      this.marker.setLatLng([lat, lng]);
    });
  }

  confirm(): void {
    this.dialogRef.close({ lat: this.selectedLat, lng: this.selectedLng });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
