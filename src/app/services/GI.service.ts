import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AngularFireDatabase } from '@angular/fire/compat/database';
@Injectable({
  providedIn: 'root'
})
export class GIService {

constructor(private httpClient : HttpClient, private db : AngularFireDatabase ) { }

getList(accountId : string){
  return this.db.object(accountId).valueChanges();
}

}

