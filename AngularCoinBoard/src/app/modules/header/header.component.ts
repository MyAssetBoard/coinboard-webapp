import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  pages = [
    { path: '/', name: ' index', icon: 'lnr-menu' },
    { path: '/login', name: ' Sign In', icon: 'lnr-lock' },
    { path: '/register', name: ' Sign Up', icon: 'lnr-pencil' },
    { path: '/profile', name: ' Profile', icon: 'lnr-user' },
    { path: '/settings', name: ' Settings', icon: 'lnr-cog' }
  ];
  constructor() { }

  ngOnInit() {
  }

}
