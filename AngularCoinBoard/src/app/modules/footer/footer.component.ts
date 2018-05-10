import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  copyright: string;

  constructor() {
    this.copyright = '© Copyright 2018 coin_board';
  }
  ngOnInit() {
  }

}
