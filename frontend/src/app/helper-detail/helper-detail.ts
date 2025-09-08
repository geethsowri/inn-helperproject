import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-helper-detail',
  standalone: true,
  templateUrl: './helper-detail.html',
  imports: [CommonModule, MatCardModule, MatDividerModule],
})
export class HelperDetailComponent {
  @Input() helper: any;
}
