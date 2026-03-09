import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardToastComponent } from '@/shared/components/ui/toast/toast.component';
import { StreamlitChatComponent } from '@/shared/components/streamlit-chat/streamlit-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZardToastComponent, StreamlitChatComponent],
  template: `
    <router-outlet></router-outlet>
    <z-toaster [richColors]="true" />
    <app-streamlit-chat />
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
