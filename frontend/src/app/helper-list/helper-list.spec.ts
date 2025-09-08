import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelperListComponent } from './helper-list';

describe('HelperList', () => {
  let component: HelperListComponent;
  let fixture: ComponentFixture<HelperListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelperListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HelperListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
