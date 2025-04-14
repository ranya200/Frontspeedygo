import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';

// Fix icônes manquantes dans Angular
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
  iconUrl: 'assets/leaflet/marker-icon.png',
  shadowUrl: 'assets/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-delivery-estimate-map',
  standalone: true,
  templateUrl: './delivery-estimate-map.component.html',
  styleUrls: ['./delivery-estimate-map.component.css']
})
export class DeliveryEstimateMapComponent implements OnInit {
  map!: L.Map;
  depotMarker!: L.Marker;
  clientMarker!: L.Marker;
  line!: L.Polyline;
  distancePopup!: L.Popup;

  @Output() distanceCalculated = new EventEmitter<number>();

  depotCoords = { lat: 36.8065, lng: 10.1815 };
  clientCoords: { lat: number, lng: number } | null = null;

  ngOnInit(): void {
    setTimeout(() => this.initMap(), 0);
  }

  initMap(): void {
    this.map = L.map('map').setView([this.depotCoords.lat, this.depotCoords.lng], 13);
    setTimeout(() => this.map.invalidateSize(), 0);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.depotMarker = L.marker([this.depotCoords.lat, this.depotCoords.lng], { draggable: true })
      .addTo(this.map)
      .bindPopup('📦 Dépôt')
      .openPopup();

    this.depotMarker.on('dragend', () => {
      const pos = this.depotMarker.getLatLng();
      this.depotCoords = { lat: pos.lat, lng: pos.lng };
      this.recalculateDistance();
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.clientMarker) this.map.removeLayer(this.clientMarker);
      if (this.line) this.map.removeLayer(this.line);
      if (this.distancePopup) this.map.removeLayer(this.distancePopup);

      this.clientCoords = { lat: e.latlng.lat, lng: e.latlng.lng };
      this.clientMarker = L.marker(e.latlng, { draggable: true })
        .addTo(this.map)
        .bindPopup('📍 Client')
        .openPopup();

      this.clientMarker.on('dragend', () => {
        const pos = this.clientMarker.getLatLng();
        this.clientCoords = { lat: pos.lat, lng: pos.lng };
        this.recalculateDistance();
      });

      this.recalculateDistance();
    });
  }

  recalculateDistance(): void {
    if (!this.clientCoords) return;

    const distance = this.calculateDistance(
      this.depotCoords.lat, this.depotCoords.lng,
      this.clientCoords.lat, this.clientCoords.lng
    );

    this.drawLineAndDistance(this.depotCoords, this.clientCoords, distance);
    this.distanceCalculated.emit(distance);
  }

  drawLineAndDistance(from: { lat: number; lng: number }, to: { lat: number; lng: number }, distance: number): void {
    if (this.line) this.map.removeLayer(this.line);
    if (this.distancePopup) this.map.removeLayer(this.distancePopup);

    this.line = L.polyline([ [from.lat, from.lng], [to.lat, to.lng] ], {
      color: 'blue',
      weight: 3,
      opacity: 0.7,
      dashArray: '5, 10'
    }).addTo(this.map);

    const midLat = (from.lat + to.lat) / 2;
    const midLng = (from.lng + to.lng) / 2;

    this.distancePopup = L.popup({ closeButton: false, autoClose: false })
      .setLatLng([midLat, midLng])
      .setContent(`<strong>Distance : ${distance} km</strong>`)
      .openOn(this.map);
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 100) / 100;
  }

  toRad(value: number): number {
    return value * Math.PI / 180;
  }
}
