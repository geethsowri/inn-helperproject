import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-helperform-page3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './helperform-page3.component.html',
  styleUrl: './helperform-page3.component.scss'
})
export class HelperformPage3Component implements OnInit {
  @Output() changePage = new EventEmitter<number>();
  @Output() submitForm = new EventEmitter<void>();
  @Input() form!: FormGroup;
  @Input() profilePreviewUrl: string | null = null; // profile image from form/page1

  data: any;

  ngOnInit() {
    // Initialize with current form value
    this.data = this.form.value;

    // Keep data reactive if form changes
    this.form.valueChanges.subscribe(val => {
      this.data = val;
    });
  }

  onPageChange() {
    this.changePage.emit(2); // back to page 2
  }

  onSubmit() {
    console.log('Submit button clicked in page3');
    console.log('Form data:', this.data);
    console.log('Form valid:', this.form.valid);
    console.log('Form errors:', this.form.errors);
    console.log('Form controls:', this.form.controls);
    
    // Check each control for errors
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control && control.errors) {
        console.log(`Control ${key} has errors:`, control.errors);
      }
    });
    
    this.submitForm.emit();
  }
}
