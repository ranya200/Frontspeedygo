import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import '@iconify/iconify'; // ✅ Import Iconify globally

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
