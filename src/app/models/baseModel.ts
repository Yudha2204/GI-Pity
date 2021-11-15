export class Model {
    public disableSort: boolean = true;
    public isLoading: boolean = false;

    public chartData = new Map<String, ChartData[]>();
    public starData = new Map<String, Star[]>();

    public selectedAccount: string = '1';
    public savedAccount: string[] = [];
    public bannerType: any[] = [
        { Name: 'Beginner' },
        { Name: 'Standart' },
        { Name: 'Weapon' },
        { Name: 'Character' },
    ];
}

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