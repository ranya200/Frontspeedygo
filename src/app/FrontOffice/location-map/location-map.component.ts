import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

// Fix icons globally
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png'
});

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css'],
  standalone: true
})
export class LocationMapComponent implements OnInit {
  selectedCoords: { lat: number, lng: number } = { lat: 40.42586086, lng: 86.9080655 };
  map: any;
  marker!: L.Marker;

  ngOnInit(): void {
    this.configMap();
  }

  /* initMap(): void {
    setTimeout(() => {
      this.map = L.map('map', {
        center: [this.selectedCoords.lat, this.selectedCoords.lng],
        zoom: 13
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(this.map);

      this.marker = L.marker(this.selectedCoords, { draggable: true }).addTo(this.map);

      this.marker.on('dragend', () => {
        const pos = this.marker.getLatLng();
        this.selectedCoords = { lat: pos.lat, lng: pos.lng };
        console.log('📍 Selected Coords:', this.selectedCoords);
      });
    }, 0);
  }
    */

  configMap(){
    this.map= L.map('map',{
      center:[40.42586086, 86.9080655],
      zoom:6
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  confirm() {
    alert(`Selected Location: ${this.selectedCoords.lat}, ${this.selectedCoords.lng}`);
  }
}
