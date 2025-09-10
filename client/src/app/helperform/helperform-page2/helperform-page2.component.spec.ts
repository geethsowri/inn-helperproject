import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperformPage2Component } from './helperform-page2.component';

describe('HelperformPage2Component', () => {
  let component: HelperformPage2Component;
  let fixture: ComponentFixture<HelperformPage2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperformPage2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelperformPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
