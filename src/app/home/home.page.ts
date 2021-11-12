import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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
  data : number[];
  labels : string[];
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public chartData = new Map<String, ChartData[]>();
  public account : string = null;
  public data : any[] = [];
  public isLoading : boolean = false;
  public bannerType : any[] = [
    {Name : 'Beginner', MaxPity : 20},
    {Name : 'Standart', MaxPity : 90},
    {Name : 'Weapon', MaxPity : 80},
    {Name : 'Character', MaxPity : 90}
  ]
  public options: Partial<ChartOptions>;

  constructor(private modalCtrl : ModalController, private service : GIService) {
    this.init();
  }

  private init() {
    let banner = localStorage.getItem('banner');
    this.account = localStorage.getItem('account');
    if (banner)
      this.bannerType = JSON.parse(banner);
  }

  async ngOnInit() {
    this.isLoading = true;
    this.spackLine();
    this.data = await new Promise((resolve, reject) => {
      this.service.getList('505732940488114177').subscribe((res : any) => {
        resolve(res);
      }, err => {
        reject(err);
      })
    })
    this.getSeries();
    this.isLoading = false;
  }

  async openModal(type : 'Add Account' | 'Refresh'){
    const modal = await this.modalCtrl.create({
      component : AccountComponent,
      componentProps : { type : type }
    })
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

  getSeries() {
    // Object.values(this.data['Beginner']).reduce((total, date) => (date ==))
    // console.log();
    let data = Object.values(this.data['Beginner']).map((x : any) => {
      return {...x, date : new Date(x.id / 1000000).toLocaleDateString()}
    })
    console.log(data);
    for (let i = 0; i < this.bannerType.length; i++) {
      let chartData  = [
        { data : [1, 8, 18, 44, 0], labels : ['21 Jan', '22 Jan', '23 Jan', '24 Jan', '25 Jan'] },
      ]
      this.chartData.set(this.bannerType[i].Name, chartData)
    }
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
      colors: ['#ffd3a5'],
      stroke: {
        width: 2,
        colors: ['#ffd3a5'],
      },
      fill: {
        colors: ['#ffd3a5'],
        gradient: {
          gradientToColors: ['#2b2d3e'],
          opacityTo: 0.2,
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
              return "Pulls"; // remove title in tooltip
            },
          },
        },
      },
    };
  }

  async doRefresh(e){
    await this.ngOnInit();
    e.target.complete();
  }
}
