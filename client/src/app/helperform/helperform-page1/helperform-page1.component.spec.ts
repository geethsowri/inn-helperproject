import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperformPage1Component } from './helperform-page1.component';

describe('HelperformPage1Component', () => {
  let component: HelperformPage1Component;
  let fixture: ComponentFixture<HelperformPage1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperformPage1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperformPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
