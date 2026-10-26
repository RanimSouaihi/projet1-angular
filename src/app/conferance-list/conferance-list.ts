import { Component,inject } from '@angular/core';
import { ConferanceDetails } from '../conferance-details/conferance-details';
import { RouterLink, RouterOutlet } from '@angular/router';
import {  ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-list',
  imports: [ConferanceDetails, RouterLink, RouterOutlet],
  templateUrl: './conferance-list.html',
  styleUrl: './conferance-list.css',
})
export class ConferanceList {
  //signal
   conferances: any[] = [];

  //constructor(private conferenceService: ConferanceService) {}
  conferenceService = inject(ConferanceService);
  
}
