import { Component, Inject, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-ride-route-map-dialog',
  template: `<div id="route-map" style="height: 500px; width: 100%; border-radius: 8px;"></div>`,
  standalone: true,
  imports: []
})
export class RideRouteMapDialogComponent implements AfterViewInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { pickup: string; dropoff: string }
  ) {}

  async ngAfterViewInit() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaG91c3NlbTEyMzQiLCJhIjoiY21hNWhxbGF3MGhzczJpc2dieTRqbWczbSJ9.WB_CdzlMnLXexWtQfyRQaA';

    const pickupCoords = await this.geocode(this.data.pickup);
    const dropoffCoords = await this.geocode(this.data.dropoff);

    const map = new mapboxgl.Map({
      container: 'route-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: pickupCoords,
      zoom: 12,
      dragRotate: false,
      touchZoomRotate: true
    });

    // 📍 Markers
    new mapboxgl.Marker({ color: 'green' })
      .setLngLat(pickupCoords)
      .setPopup(new mapboxgl.Popup().setText('Pickup Location'))
      .addTo(map);

    new mapboxgl.Marker({ color: 'red' })
      .setLngLat(dropoffCoords)
      .setPopup(new mapboxgl.Popup().setText('Dropoff Location'))
      .addTo(map);

    // 🛣️ Draw route
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords[0]},${pickupCoords[1]};${dropoffCoords[0]},${dropoffCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    const res = await fetch(directionsUrl);
    const json = await res.json();
    const route = json.routes[0].geometry;

    map.on('load', () => {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: route
        }
      });

      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': '#007bff',
          'line-width': 5
        }
      });

      // ✅ Fix pointer/drag after dialog opens
      setTimeout(() => {
        map.resize();
      }, 300);
    });
  }

  private async geocode(location: string): Promise<[number, number]> {
    const encoded = encodeURIComponent(location);
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json?access_token=${mapboxgl.accessToken}`
    );
    const data = await response.json();
    const [lng, lat] = data.features[0].center;
    return [lng, lat];
  }
}
