import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import * as L from 'leaflet';


import { AppModule } from './app/app.module';
import '@iconify/iconify'; // ✅ Import Iconify globally
import 'zone.js'; // Required by Angular

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  delete (L.Icon.Default.prototype as any)._getIconUrl;

  const iconRetinaUrl = 'assets/map-icons/marker-icon-2x.png';
  const iconUrl = 'assets/map-icons/marker-icon.png';
  const shadowUrl = 'assets/map-icons/marker-shadow.png';
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  });
