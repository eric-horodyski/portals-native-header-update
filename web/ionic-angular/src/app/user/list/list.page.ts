import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { NativeHeader } from 'src/app/plugins/NativeHeaderPlugin';
import User from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {
  users$: Observable<User[]> = of([]);

  constructor(public userService: UserService) {
    this.users$ = this.userService.users$;
  }

  async ngOnInit() {
    this.userService.loadUsers().subscribe();
  }
}
