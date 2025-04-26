import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LocationPickerComponent implements OnInit {
  @Output() locationSelected = new EventEmitter<{ mode: 'pickup' | 'dropoff', address: string, lat: number, lng: number }>();

  map!: L.Map;
  marker!: L.Marker;
  mode: 'pickup' | 'dropoff' = 'pickup';

  ngOnInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  switchMode(): void {
    this.mode = this.mode === 'pickup' ? 'dropoff' : 'pickup';
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [36.8065, 10.1815],
      zoom: 13
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (this.marker) this.map.removeLayer(this.marker);

      this.marker = L.marker([lat, lng]).addTo(this.map);
      const address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      this.locationSelected.emit({
        mode: this.mode,
        address,
        lat,
        lng
      });
    });
  }
}
