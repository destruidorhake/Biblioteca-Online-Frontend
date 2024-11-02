import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService  {

  constructor() {
    console.log('Google Analytics Service initialized.');
  }

  pageView(url: string) {
    if (typeof gtag === 'function') {
      gtag('config', 'G-2TN22C6V4M', {
        'page_path': url,
      });
    } else {
      console.warn('Google Analytics não está disponível. Certifique-se de que o script foi carregado.');
    }
  }

  event(action: string, category: string, label?: string) {
    if (typeof gtag === 'function') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
      });
    } else {
      console.warn('Google Analytics não está disponível. Certifique-se de que o script foi carregado.');
    }
  }
}
