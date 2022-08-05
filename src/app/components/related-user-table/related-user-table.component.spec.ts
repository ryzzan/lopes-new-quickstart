import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedUserTableComponent } from './related-user-table.component';

describe('RelatedUserTableComponent', () => {
  let component: RelatedUserTableComponent;
  let fixture: ComponentFixture<RelatedUserTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedUserTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedUserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
