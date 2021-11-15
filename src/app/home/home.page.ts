import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Model } from '../models/baseModel';
import { ChartOptions } from '../models/chart';
import { GIService } from '../services/GI.service';
import { AccountComponent } from './account/account.component';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public model = new Model();
  public options: Partial<ChartOptions>;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private service: GIService
  ) { }

  private init() {
    let banner = localStorage.getItem('banner');
    let account = localStorage.getItem('selectedAccount');
    let accountData = localStorage.getItem('account');
    let sort = localStorage.getItem('sort');
    if (banner) this.model.bannerType = JSON.parse(banner);

    if (account) this.model.selectedAccount = account;

    if (sort) this.model.disableSort = Boolean(sort);

    if (accountData) {
      this.model.savedAccount = JSON.parse(accountData);
    }
    this.spackLine();
  }

  async ngOnInit() {
    this.model.isLoading = true;
    let now = performance.now();
    this.init();
    await this.getSeries();
    let end = performance.now();
    console.log('time taken', end - now);
    this.model.isLoading = false;
  }

  async openModal(type: 'Add' | 'Refresh' | 'Search') {
    const modal = await this.modalCtrl.create({
      component: AccountComponent,
      componentProps: { type: type, model: this.model },
    });
    return await modal.present();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.model.bannerType, event.previousIndex, event.currentIndex);
    let tempArray = this.model.bannerType[event.currentIndex];
    let tempArray2 = this.model.bannerType[event.previousIndex];
    this.model.bannerType[event.currentIndex] = tempArray;
    this.model.bannerType[event.previousIndex] = tempArray2;
    localStorage.setItem('banner', JSON.stringify(this.model.bannerType));
  }

  async getSeries() {
    //Get every banner data from database
    for (let i = 0; i < this.model.bannerType.length; i++) {
      let data: any = await new Promise((resolve, reject) => {
        this.service
          .getListBanner(this.model.selectedAccount, this.model.bannerType[i].Name)
          .subscribe(
            (res: any) => {
              resolve(res.reverse());
            },
            async (err) => {
              reject(err);
              await this.showToast(err);
            }
          );
      });
      //Get every 5 stars and pity
      let data5star = await this.get5star(this.model.bannerType[i].Name);
      this.model.starData.set(this.model.bannerType[i].Name, Object.values(data5star));
      let dataSeries: any[] = Object.values(this.groupBy(data));
      dataSeries = dataSeries.slice(dataSeries.length - 5);
      let series: number[] = [];
      for (let j = 0; j < dataSeries.length; j++) {
        series.push(dataSeries[j].length);
      }
      let labels = Object.keys(this.groupBy(data));
      labels = labels.slice(labels.length - 5);
      this.model.chartData.set(this.model.bannerType[i].Name, [
        { data: series, labels: labels },
      ]);
    }
  }

  async get5star(bannerName: string) {
    let data5star = await new Promise((resolve, reject) => {
      this.service.getPity(this.model.selectedAccount, bannerName).subscribe(
        (res: any) => {
          resolve(res);
        },
        async (err) => {
          reject(err);
          await this.showToast(err);
        }
      );
    });
    return data5star;
  }

  /**
   * Grouping data with date
   * @param data 
   * @returns Object with date as key
   */
  groupBy(data: any[]) {
    return data.reduce(function (r, a) {
      r[a.time.split(' ')[0]] = r[a.time.split(' ')[0]] || [];
      r[a.time.split(' ')[0]].push(a);
      return r;
    }, Object.create(null));
  }

  async onChangeAccount() {
    localStorage.setItem('selectedAccount', this.model.selectedAccount);
    await this.ngOnInit();
  }

  spackLine() {
    this.options = {
      chart: {
        type: 'area',
        height: 120,
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          top: 1,
          left: 1,
          blur: 2,
          opacity: 0.2,
        },
      },
      markers: {
        size: 0.8,
      },
      grid: {
        padding: {
          top: 20,
          left: 110,
          bottom: 10,
        },
      },
      colors: ['#de542c'],
      stroke: {
        width: 2,
        colors: ['#de542c'],
      },
      fill: {
        colors: ['#ef7e32'],
        gradient: {
          gradientToColors: ['#ef7e323b'],
          opacityTo: 0.6,
        },
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: true,
        },
        y: {
          title: {
            formatter: function formatter(val) {
              return 'Pulls'; // remove title in tooltip
            },
          },
        },
      },
    };
  }

  async doRefresh(e) {
    await this.ngOnInit();
    e.target.complete();
  }

  async openAlert() {
    let alert = await this.alertCtrl.create({
      header: 'Delete Account',
      message: `Are You Sure Delete ${this.model.selectedAccount} account?`,
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: async () => {
            let account = JSON.parse(localStorage.getItem('account'));
            let filterAccount = account.filter(
              (x) => x !== this.model.selectedAccount
            );
            localStorage.setItem('selectedAccount', '1');
            localStorage.setItem('account', JSON.stringify(filterAccount));
            await this.ngOnInit();
          },
        },
      ],
    });

    return await alert.present();
  }

  async showToast(msg: string) {
    let toast = await this.toastCtrl.create({
      message: msg,
      mode: 'ios',
    });

    return await toast.present();
  }
}
