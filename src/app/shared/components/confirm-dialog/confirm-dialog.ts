import { Component, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  dialogState = signal<{
    isOpen: boolean;
    data: ConfirmDialogData | null;
    resolve: ((value: boolean) => void) | null;
  }>({
    isOpen: false,
    data: null,
    resolve: null
  });

  confirm(title: string, message: string, confirmColor: 'primary' | 'danger' = 'primary'): Promise<boolean> {
    return new Promise((resolve) => {
      this.dialogState.set({
        isOpen: true,
        data: {
          title,
          message,
          confirmText: 'Đồng ý',
          cancelText: 'Hủy bỏ',
          confirmColor
        },
        resolve
      });
    });
  }

  close(result: boolean) {
    const currentState = this.dialogState();
    if (currentState.resolve) {
      currentState.resolve(result);
    }
    this.dialogState.set({
      isOpen: false,
      data: null,
      resolve: null
    });
  }
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (confirmService.dialogState().isOpen) {
      <div class="confirm-overlay" (click)="close(false)">
        <div class="confirm-box" (click)="$event.stopPropagation()">
          <div class="confirm-header">
            <h3>{{ confirmService.dialogState().data?.title }}</h3>
            <button class="close-btn" (click)="close(false)">&times;</button>
          </div>
          
          <div class="confirm-body">
            <p>{{ confirmService.dialogState().data?.message }}</p>
          </div>

          <div class="confirm-footer">
            <button class="btn-cancel" (click)="close(false)">
              {{ confirmService.dialogState().data?.cancelText }}
            </button>
            <button 
              class="btn-confirm" 
              [class.danger]="confirmService.dialogState().data?.confirmColor === 'danger'"
              (click)="close(true)">
              {{ confirmService.dialogState().data?.confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease-out;
    }

    .confirm-box {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      animation: scaleIn 0.2s ease-out;
      overflow: hidden;
    }

    .confirm-header {
      padding: 20px 24px;
      border-bottom: 1px solid #f0f0f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .confirm-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #9ca3af;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background-color: #f3f4f6;
      color: #4b5563;
    }

    .confirm-body {
      padding: 24px;
      color: #4b5563;
      font-size: 15px;
      line-height: 1.6;
    }

    .confirm-footer {
      padding: 20px 24px;
      background-color: #fafafa;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: none;
    }

    button {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }

    .btn-cancel {
      background-color: white;
      border-color: #d0d0d0;
      color: #333;
    }

    .btn-cancel:hover {
      background-color: #f0f0f0;
    }

    .btn-confirm {
      background-color: #6366F1;
      color: white;
    }

    .btn-confirm:hover {
      background-color: #4F46E5;
    }

    .btn-confirm.danger {
      background-color: #DC2626;
    }

    .btn-confirm.danger:hover {
      background-color: #B91C1C;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(public confirmService: ConfirmService) { }

  close(result: boolean) {
    this.confirmService.close(result);
  }
}
