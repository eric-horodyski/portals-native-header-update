import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import User from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  user: User | undefined;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    const uuid = this.route.snapshot.paramMap.get('id') || '';
    this.user = this.userService.getUserByUuid(uuid)!;
  }
}
