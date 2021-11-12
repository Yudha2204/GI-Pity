import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  type : 'Add Account' | 'Refresh';
  constructor(private modal : ModalController) { }

  ngOnInit() {
  }

  onDismiss(){
    this.modal.dismiss();
  }

}
