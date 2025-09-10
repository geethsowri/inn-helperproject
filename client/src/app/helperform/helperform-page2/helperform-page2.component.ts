import { Component, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-helperform-page2',
  standalone: true,
  imports: [],
  templateUrl: './helperform-page2.component.html',
  styleUrl: './helperform-page2.component.scss'
})
export class HelperformPage2Component {

  @Input () categoryNum!: number;
  @Input() form!: FormGroup;

  @Output () changePage = new EventEmitter<number>();

  onPageChange(num: number) {
    this.changePage.emit(this.categoryNum + num);
  }

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileUpload() {
    this.fileInput.nativeElement.click();
  }
}
