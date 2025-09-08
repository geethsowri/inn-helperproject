// helper-list.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-helper-list',
  standalone: true,
  templateUrl: './helper-list.html',
  imports: [CommonModule, MatListModule, HttpClientModule],
})
export class HelperListComponent {
  helpers: any[] = [];
  @Output() selectHelper = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>('http://localhost:5000/api/helpers')
      .subscribe(data => this.helpers = data);
  }
}