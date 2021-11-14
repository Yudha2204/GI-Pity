import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root',
})
export class GIService {
  constructor(
    private httpClient: HttpClient,
    private db: AngularFireDatabase,
    private toastCtrl: ToastController
  ) {}
  private API_URL: string = `https://hk4e-api-os.mihoyo.com/event/gacha_info/api/getGachaLog?authkey_ver=1&lang=en-us`;

  getListBanner(accountId: string, bannerName: string) {
    return this.db
      .list('users/' + accountId, (q) => {
        return q.child(bannerName);
      })
      .valueChanges();
  }

  getPity(accountId: string, bannerName: string) {
    return this.db
      .list('users/' + accountId + '/Pity', (q) => {
        return q.child(bannerName);
      })
      .valueChanges();
  }

  searchAccount(query: string) {
    return this.db.object('users/' + query).valueChanges();
  }

  getDataGacha(url: string) {
    debugger;
    if (!url.includes('authkey=')) {
      this.toastCtrl.create({ message: 'URL Not Valid' });
      return;
    }

    url = this.createUri(url, '100', 0, '0');
    this.httpClient.get(url).subscribe((res) => {});
  }

  private createUri(
    uri: string,
    type: string,
    page: number,
    end: string
  ): string {
    let authKey = this.getAuthKey(uri);
    let lastQ = `&gacha_type=${type}&size=20&page=${page}&end_id=${end}`;
    let resultUri = this.API_URL + `&${authKey}` + lastQ;
    return resultUri;
  }

  private getAuthKey(uri: string): string {
    uri = uri.split('&').filter((x) => x.includes('authkey='))[0];
    return uri;
  }
}
