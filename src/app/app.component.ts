import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from '@/shared/components/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZardToastComponent],
  template: `
    <router-outlet></router-outlet>
    <z-toaster [richColors]="true" />
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
