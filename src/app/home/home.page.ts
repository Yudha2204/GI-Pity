import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { GIService } from '../services/GI.service';
import { AccountComponent } from './account/account.component';

export type ChartOptions = {
  chart: ApexChart;
  series: ApexAxisChartSeries | any[];
  stroke: ApexStroke;
  markers: ApexMarkers;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  colors: any[];
  labels: any[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  subtitle: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  fill: ApexFill;
  plotOptions: ApexPlotOptions;
};

export type ChartData = {
  data: number[];
  labels: string[];
};

export type ChipData = {
  star: Star;
};

export type Star = {
  name: string;
  pity: number;
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public chartData = new Map<String, ChartData[]>();
  public chipData = new Map<String, Star[]>();
  public enableSort: boolean = true;
  public selectedAccount: string = '1';
  public savedAccount: string[];
  public data: any[] = [];
  public isLoading: boolean = false;
  public bannerType: any[] = [
    { Name: 'Beginner' },
    { Name: 'Standart' },
    { Name: 'Weapon' },
    { Name: 'Character' },
  ];
  public options: Partial<ChartOptions>;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private service: GIService
  ) {}

  private init() {
    let banner = localStorage.getItem('banner');
    let account = localStorage.getItem('selectedAccount');
    let accountData = localStorage.getItem('account');
    let sort = localStorage.getItem('sort');
    if (banner) this.bannerType = JSON.parse(banner);

    if (account) this.selectedAccount = account;

    if (sort) this.enableSort = Boolean(sort);

    if (accountData) {
      this.savedAccount = JSON.parse(accountData);
    }
    this.spackLine();
  }

  async ngOnInit() {
    this.isLoading = true;
    let now = performance.now();
    this.init();
    await this.getSeries();
    let end = performance.now();
    console.log('time taken', end - now);
    this.isLoading = false;
  }

  async openModal(type: 'Add' | 'Refresh' | 'Search') {
    const modal = await this.modalCtrl.create({
      component: AccountComponent,
      componentProps: { type: type },
    });
    return await modal.present();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.bannerType, event.previousIndex, event.currentIndex);
    let tempArray = this.bannerType[event.currentIndex];
    let tempArray2 = this.bannerType[event.previousIndex];
    this.bannerType[event.currentIndex] = tempArray;
    this.bannerType[event.previousIndex] = tempArray2;
    localStorage.setItem('banner', JSON.stringify(this.bannerType));
  }

  async getSeries() {
    for (let i = 0; i < this.bannerType.length; i++) {
      let data: any = await new Promise((resolve, reject) => {
        this.service
          .getListBanner(this.selectedAccount, this.bannerType[i].Name)
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
      let data5star = await this.get5star(this.bannerType[i].Name);
      this.chipData.set(this.bannerType[i].Name, Object.values(data5star));
      let dataValue: any[] = Object.values(this.groupBy(data));
      dataValue = dataValue.slice(dataValue.length - 5);
      let value: number[] = [];
      for (let j = 0; j < dataValue.length; j++) {
        value.push(dataValue[j].length);
      }
      let dataLabels = Object.keys(this.groupBy(data));
      dataLabels = dataLabels.slice(dataLabels.length - 5);
      this.chartData.set(this.bannerType[i].Name, [
        { data: value, labels: dataLabels },
      ]);
    }
  }

  async get5star(bannerName: string) {
    let data5star = await new Promise((resolve, reject) => {
      this.service.getPity(this.selectedAccount, bannerName).subscribe(
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

  groupBy(data: any[]) {
    return data.reduce(function (r, a) {
      r[a.time.split(' ')[0]] = r[a.time.split(' ')[0]] || [];
      r[a.time.split(' ')[0]].push(a);
      return r;
    }, Object.create(null));
  }

  async onChangeAccount() {
    localStorage.setItem('selectedAccount', this.selectedAccount);
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
      message: `Are You Sure Delete ${this.selectedAccount} account?`,
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Yes',
          handler: async () => {
            let account = JSON.parse(localStorage.getItem('account'));
            let filterAccount = account.filter(
              (x) => x !== this.selectedAccount
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
