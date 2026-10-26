import { Component, input, output ,inject} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ConferanceService } from '../services/conferance';

@Component({
  selector: 'app-conferance-details',
  imports: [RouterLink],
  templateUrl: './conferance-details.html',
  styleUrl: './conferance-details.css',
})
export class ConferanceDetails {
  //   conferances :any[]=[
  //   {id:1,name:"angular",date:"2023-01-01",place:"tunis"},
  //   {id:2,name:"react",date:"2023-02-01",place:"sfax"},
  //   {id:3,name:"vue",date:"2023-03-01",place:"sousse"},
  // ]
//   conf=input<any>()
//  inc = output();
//   onsave(){
//     this.inc.emit();
//   }
//private aroute = inject(ActivatedRoute);
//activated Route
// constructor(private aroute:ActivatedRoute){
//   this.id = this.aroute.snapshot.params['id'];
//   console.log(this.id);
  
// }
conference?: any;
constructor(
  private conferenceService: ConferanceService
) {}
 id= input.required<string>();

 ngOnInit() {
const id = Number(this.id());
  this.conference = this.conferenceService.getById(id);
 
 }



// constructor(
//   private route: ActivatedRoute,
//   private conferenceService: Conferance
// ) {
//   const id = Number(this.route.snapshot.params['id']);
// }
  private r = inject(Router);
   goBack() {
    this.r.navigate(['/list']);
  }
}
