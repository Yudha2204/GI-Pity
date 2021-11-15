import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  userId: string;
  bannerName: string;
  constructor(private ar: ActivatedRoute) { }

  ngOnInit() {
    this.ar.params.subscribe((param) => {
      this.userId = param['id'];
      this.bannerName = param['banner'];
    });
  }

}
