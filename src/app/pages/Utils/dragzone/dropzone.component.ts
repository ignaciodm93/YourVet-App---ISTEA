import { Component, Output, EventEmitter, OnDestroy, Input, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.css']
})
export class DropzoneComponent implements OnDestroy {
  
  @Output() base64Ready: EventEmitter<string> = new EventEmitter<string>();
  imageBase64: string | undefined;
  
  @Output() formatError: EventEmitter<string> = new EventEmitter<string>();
  
  @Input()
  set initialImageBase64(value: string | undefined) {
    this._initialImageBase64 = value;
    this.loadInitialImage();
  }

  get initialImageBase64(): string | undefined {
    return this._initialImageBase64;
  }
  
  private _initialImageBase64: string | undefined;

  onFileDropped($event: any) {
    this.preventDefault($event);
    const file = $event.dataTransfer.files[0];
    this.handleFile(file);
  }

  onFileSelected($event: any) {
    this.preventDefault($event);
    const file = $event.target.files[0];
    this.handleFile(file);
  }

  private handleFile(file: File) {
    if (file && this.isImageFile(file) && this.isPNG(file)) {
      const reader = new FileReader();
      reader.onload = (event) => {
        this.imageBase64 = event.target?.result as string;
        this.base64Ready.emit(this.imageBase64);
      };
      reader.readAsDataURL(file);
    } else {
      this.formatError.emit();
    }
  }

  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private isPNG(file: File): boolean {
    return file.type === 'image/png';
  }

  preventDefault($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.imageBase64 = null;
  }

  loadInitialImage() {
    if (this.initialImageBase64) {
      this.imageBase64 = "data:image/png;base64," + this.initialImageBase64;
      this.base64Ready.emit(this.imageBase64);
    }
  }
}
