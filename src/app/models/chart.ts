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