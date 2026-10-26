import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCoferance } from './add-coferance';

describe('AddCoferance', () => {
  let component: AddCoferance;
  let fixture: ComponentFixture<AddCoferance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCoferance],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCoferance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
