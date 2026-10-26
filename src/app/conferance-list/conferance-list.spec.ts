import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferanceList } from './conferance-list';

describe('ConferanceList', () => {
  let component: ConferanceList;
  let fixture: ComponentFixture<ConferanceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConferanceList],
    }).compileComponents();

    fixture = TestBed.createComponent(ConferanceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
