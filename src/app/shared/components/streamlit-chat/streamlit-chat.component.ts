import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-streamlit-chat',
    standalone: true,
    imports: [CommonModule],
    template: `
    <!-- Toggle Button -->
    <button class="chat-fab" (click)="toggleChat()" [attr.aria-label]="isOpen() ? 'Close chat' : 'Open chat'">
      <span class="chat-icon">{{ isOpen() ? '✕' : '💬' }}</span>
    </button>

    <!-- Iframe Container -->
    <div class="chat-container" [class.open]="isOpen()">
      <div class="chat-header">
        <span>🤖 Chatbot Nhí Nhảnh</span>
        <button class="close-btn" (click)="toggleChat()">✕</button>
      </div>
      <iframe
        [src]="streamlitUrl"
        frameborder="0"
        allow="microphone"
        title="Streamlit Chatbot"
      ></iframe>
    </div>
  `,
    styles: [`
    .chat-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 1001;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #1E293B;
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(79, 70, 229, 0.45);
      font-size: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, transform 0.2s;

      &:hover {
        background: #303A4A;
        transform: scale(1.08);
      }
    }

    .chat-container {
      position: fixed;
      bottom: 90px;
      right: 24px;
      width: 400px;
      height: 600px;
      z-index: 1000;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
      display: flex;
      flex-direction: column;
      background: #fff;
      opacity: 0;
      transform: translateY(20px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;

      &.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }
    }

    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: #1E293B;
      color: white;
      font-weight: 600;
      font-size: 15px;
    }

    .close-btn {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      padding: 2px 6px;
      border-radius: 4px;

      &:hover {
        background: rgba(255,255,255,0.15);
      }
    }

    iframe {
      flex: 1;
      width: 100%;
      height: 100%;
      border: none;
    }
  `]
})
export class StreamlitChatComponent {
    private sanitizer = inject(DomSanitizer);

    isOpen = signal(false);

    streamlitUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://tinytqa-sale-chatbot.hf.space'
    );

    toggleChat() {
        this.isOpen.update(v => !v);
    }
}
