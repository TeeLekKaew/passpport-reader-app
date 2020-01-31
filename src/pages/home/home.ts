import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { NFC, Ndef } from '@ionic-native/nfc';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs/Subscription';
// import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
declare var PassportReader: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  granted: boolean;
  denied: boolean;
  scanned: boolean;
  tagId: string;
  tagData: string;
  tagTechList: string;
  sesReadNFCData: string;

  passportNumber = 'AA2293222';
  birthDate = '1984-05-16';
  expireDate = '2018-10-15';

  myImg = "";

  sub: Subscription;


  constructor(private alertCtrl: AlertController,
     private platform: Platform,
     public navCtrl: NavController,
     private nfc: NFC,
     private ndef: Ndef,
     private toastCtrl: ToastController,
     private domSanitizer: DomSanitizer
     ) {
      this.resetScanData();
  }

resetScanData() {
  this.granted = false;
  this.scanned = false;
  this.tagId = "";
}

ionViewDidEnter() {


}

scanNfc() {
  this.platform.ready().then(() => {
    this.nfc.enabled().then((resolve) => {
      this.addListenNFC();
    }).catch((reject) => {
      alert("NFC is not supported by your Device");
    });

  });
}

stopNfc() {
  this.sub.unsubscribe();
}

addListenNFC() {
  this.scanned = true;

  let param = {
    passportNumber: this.passportNumber,
    birthDate: this.birthDate,
    expirationDate: this.expireDate
  };



  this.sub = this.nfc.addMimeTypeListener(JSON.stringify(param)
    ).subscribe(data => {
    if (data && data.tag && data.tag.id) {

      this.scanned = false;

      this.tagData = this.getCurDateTime() + "\n" + JSON.stringify(data);
      // let tagId = this.nfc.bytesToHexString(data.tag.id);
      // const imageBase64 = data.tag.imageBase64;

      // this.myImg= "data:image/jpeg;base64,"+imageBase64;
    }
  });

  // this.sub = this.nfc.addTagDiscoveredListener(
  //   ).subscribe(data => {
  //   if (data && data.tag && data.tag.id) {


  //     this.scanned = false;

  //     this.tagData = this.getCurDateTime() + "\n" + JSON.stringify(data);
  //     // let tagId = this.nfc.bytesToHexString(data.tag.id);

  //   }
  // });
}

getCurDateTime() {
  var currentdate = new Date();
  var datetime = "Last Sync: " + currentdate.getDate() + "/"
  + (currentdate.getMonth()+1)  + "/"
  + currentdate.getFullYear() + " @ "
  + currentdate.getHours() + ":"
  + currentdate.getMinutes() + ":"
  + currentdate.getSeconds();
  return datetime;
}

sesReadNFC(data): void {
}

failNFC(err) {
  alert("Error while reading: Please Retry");
}
}
