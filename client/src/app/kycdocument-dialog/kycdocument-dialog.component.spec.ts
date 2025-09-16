import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycdocumentDialogComponent } from './kycdocument-dialog.component';

describe('KycdocumentDialogComponent', () => {
  let component: KycdocumentDialogComponent;
  let fixture: ComponentFixture<KycdocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycdocumentDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KycdocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
