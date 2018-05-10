import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormblockComponent } from './formblock.component';

describe('FormblockComponent', () => {
  let component: FormblockComponent;
  let fixture: ComponentFixture<FormblockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormblockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormblockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
