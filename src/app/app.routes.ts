import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ConferenceListComponent } from './components/conference-list/conference-list';
import { ConferenceDetailComponent } from './components/conference-detail/conference-detail';
import { ConferenceFormComponent } from './components/conference-form/conference-form';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'list', component: ConferenceListComponent },
  { path: 'detail/:id', component: ConferenceDetailComponent },
  { path: 'add-conference', component: ConferenceFormComponent },
  { path: 'edit-conference/:id', component: ConferenceFormComponent },
];
