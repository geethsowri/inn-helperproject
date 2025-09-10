import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperformPage3Component } from './helperform-page3.component';

describe('HelperformPage3Component', () => {
  let component: HelperformPage3Component;
  let fixture: ComponentFixture<HelperformPage3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperformPage3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperformPage3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
