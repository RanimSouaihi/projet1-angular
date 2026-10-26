import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferanceDetails } from './conferance-details';

describe('ConferanceDetails', () => {
  let component: ConferanceDetails;
  let fixture: ComponentFixture<ConferanceDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferanceDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferanceDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
