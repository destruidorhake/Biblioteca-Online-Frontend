import { Component } from '@angular/core';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {

  scrollDown() {
    window.scrollBy({
      top: window.innerHeight, // scrolla uma tela inteira para baixo
      behavior: 'smooth'
    });
  }
}
