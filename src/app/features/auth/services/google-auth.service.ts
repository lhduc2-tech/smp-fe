import { Injectable } from '@angular/core';

declare global {
  interface Window {
    google: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private initialized = false;

  private loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => resolve();
      script.onerror = () => reject('Google Identity script failed to load');

      document.head.appendChild(script);
    });
  }

  async initialize(callback: (idToken: string) => void): Promise<void> {
    if (this.initialized) return;

    await this.loadScript();

    window.google.accounts.id.initialize({
      client_id: '928084972512-3n247c94j8l4ij2omh2s5ngigvn3gr04.apps.googleusercontent.com',
      callback: (response: any) => {
        if (response?.credential) {
          callback(response.credential);
        }
      }
    });

    this.initialized = true;
  }

  renderButton(elementId: string): void {
    if (!window.google) {
      console.error('Google SDK not available');
      return;
    }

    const el = document.getElementById(elementId);
    if (!el) return;

    window.google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      width: 300
    });
  }
}
