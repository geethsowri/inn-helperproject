import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpersListComponent } from './helpers-list.component';

describe('HelpersListComponent', () => {
  let component: HelpersListComponent;
  let fixture: ComponentFixture<HelpersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelpersListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HelpersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
