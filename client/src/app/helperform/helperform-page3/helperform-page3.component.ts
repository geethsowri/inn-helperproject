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
}
