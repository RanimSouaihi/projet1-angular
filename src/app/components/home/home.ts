import { Component, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  name: string = 'mohamed';
  className: string = '4ssa5';
  angularLogo: string = 'https://angular.io/assets/images/logos/angular/angular.svg';
  inputName: string = '';

  counter = signal<number>(0);
  computedCounter = computed(() => this.counter());

  students: string[] = ['ahmed', 'mohamed', 'ali', 'sami'];
  studentsObj = [
    { name: 'ahmed', age: 20 },
    { name: 'mohamed', age: 30 },
    { name: 'ali', age: 40 }
  ];

  onEventBinding(): void {
    alert('Event binding triggered!');
  }

  increment(): void {
    this.counter.update(count => count + 1);
  }

  incSimple(): void {
    this.counter.set(this.counter() + 1);
  }
}
