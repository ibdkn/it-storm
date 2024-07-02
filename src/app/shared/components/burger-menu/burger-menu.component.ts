import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-burger-menu',
  templateUrl: './burger-menu.component.html',
  styleUrls: ['./burger-menu.component.scss']
})
export class BurgerMenuComponent implements OnInit {
  @Output() toggle = new EventEmitter<void>();
  @Input() isOpen: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
