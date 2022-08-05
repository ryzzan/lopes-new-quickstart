import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedUserFormComponent } from './related-user-form.component';

describe('RelatedUserFormComponent', () => {
  let component: RelatedUserFormComponent;
  let fixture: ComponentFixture<RelatedUserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedUserFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
