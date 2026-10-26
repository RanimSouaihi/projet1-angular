import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConferance } from './update-conferance';

describe('UpdateConferance', () => {
  let component: UpdateConferance;
  let fixture: ComponentFixture<UpdateConferance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateConferance],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateConferance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
