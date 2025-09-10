import { Component, Input, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-tracker',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './form-tracker.component.html',
  styleUrl: './form-tracker.component.scss'
})
export class FormTrackerComponent {

  constructor(private router:Router) {}

  @Input() categ!: Signal<number>;

  Helpersroute() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/helpers']);
    });
  }
}
