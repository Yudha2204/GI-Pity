import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Model } from 'src/app/models/baseModel';
import { GIService } from 'src/app/services/GI.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {
  model: Model;
  type: 'Add' | 'Refresh' | 'Search';
  formGroup: FormGroup;
  toast: Promise<void>;
  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private service: GIService,
    private alertController: AlertController
  ) {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
    });
  }

  public focused(formControlName: string): boolean {
    return this.formGroup.controls[formControlName].valid;
  }

  ngOnInit() {
    console.log(this.model);
  }

  onDismiss() {
    this.modalCtrl.dismiss();
  }

  onBlur(event: any, formControlName) {
    const value = event.target.value;

    if (!value) {
      this.formGroup.controls[formControlName].untouched;
    }
  }

  saveAccount() {
    this.service.getDataGacha(this.formGroup.get('url').value).subscribe((res) => {

    });
  }

  searchAccount() {
    if (this.model.savedAccount.includes(this.formGroup.get('name').value)) {

    }
    this.service
      .searchAccount(this.formGroup.get('name').value)
      .subscribe(async (res) => {
        if (res) {
          let confirm = await this.alertController.create({
            header: 'Account Found',
            message: 'Want a save this account?',
            buttons: [
              {
                text: 'Cancel',
              },
              {
                text: 'Save',
                handler: () => {
                  let accounts = localStorage.getItem('account');
                  if (!accounts) {
                    localStorage.setItem('account', JSON.stringify([]));
                  }
                  let acc = JSON.parse(localStorage.getItem('account'));
                  let d = acc.filter(
                    (x) => x == this.formGroup.get('name').value
                  );
                  if (d.length === 0)
                    localStorage.setItem(
                      'account',
                      JSON.stringify([...acc, this.formGroup.get('name').value])
                    );
                },
              },
            ],
          });
          confirm.present();
        }
      });
  }
}
