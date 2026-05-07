import { Component, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="lightbox-overlay" (click)="closeLightbox()">
        <div class="lightbox-modal" (click)="$event.stopPropagation()">
          <button class="lightbox-close" (click)="closeLightbox()" aria-label="Close lightbox">×</button>
          @if (currentImage()) {
            <img [src]="currentImage()!.src" [alt]="currentImage()!.alt" class="lightbox-image" />
            @if (currentImage()!.caption) {
              <p class="lightbox-caption">{{ currentImage()!.caption }}</p>
            }
          }
          <div class="lightbox-controls">
            <button (click)="prevImage()" class="lightbox-btn" [disabled]="!hasPrev()" aria-label="Previous image">
              ← Previous
            </button>
            <span class="lightbox-counter">{{ (currentIndex() + 1) }} / {{ images().length }}</span>
            <button (click)="nextImage()" class="lightbox-btn" [disabled]="!hasNext()" aria-label="Next image">
              Next →
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .lightbox-modal {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: #000;
      border-radius: 8px;
      box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
      animation: slideIn 0.3s ease-out;
    }

    @keyframes slideIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .lightbox-image {
      max-width: 100%;
      max-height: calc(90vh - 120px);
      object-fit: contain;
      display: block;
    }

    .lightbox-caption {
      color: #fff;
      text-align: center;
      padding: 1rem;
      font-size: 0.95rem;
      background: rgba(0, 0, 0, 0.3);
      margin: 0;
    }

    .lightbox-close {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      border: none;
      font-size: 2rem;
      width: 50px;
      height: 50px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: background 0.2s;
    }

    .lightbox-close:hover {
      background: rgba(255, 255, 255, 0.4);
    }

    .lightbox-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.5);
    }

    .lightbox-btn {
      background: #C5192D;
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s;
    }

    .lightbox-btn:hover:not(:disabled) {
      background: #9B1422;
    }

    .lightbox-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .lightbox-counter {
      color: #fff;
      font-size: 0.9rem;
      min-width: 60px;
      text-align: center;
    }

    @media (max-width: 640px) {
      .lightbox-modal {
        max-width: 95vw;
      }
      
      .lightbox-image {
        max-height: calc(80vh - 100px);
      }

      .lightbox-controls {
        flex-direction: column;
        gap: 0.5rem;
      }

      .lightbox-btn {
        width: 100%;
      }
    }
  `]
})
export class LightboxComponent {
  isOpen = signal(false);
  images = signal<LightboxImage[]>([]);
  currentIndex = signal(0);

  currentImage = computed(() => {
    const imgs = this.images();
    return imgs[this.currentIndex()] || null;
  });

  hasPrev = computed(() => this.currentIndex() > 0);
  hasNext = computed(() => this.currentIndex() < this.images().length - 1);

  openLightbox(images: LightboxImage[], startIndex = 0): void {
    this.images.set(images);
    this.currentIndex.set(startIndex);
    this.isOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.isOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  nextImage(): void {
    if (this.hasNext()) {
      this.currentIndex.update((i: number) => i + 1);
    }
  }

  prevImage(): void {
    if (this.hasPrev()) {
      this.currentIndex.update((i: number) => i - 1);
    }
  }
}
