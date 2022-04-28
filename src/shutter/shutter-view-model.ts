import { Observable,fromObject, GestureEventData } from '@nativescript/core'
import { DataFormEventData } from 'nativescript-ui-dataform';
import { ObservableProperty } from '../shared/observable-property-decorator';

import { SelectedPageService } from '../shared/selected-page-service'

export class ShutterViewModel extends Observable {
  constructor() {
    super()

    SelectedPageService.getInstance().updateSelectedPage('shutter')
    /*setInterval(()=>{
        this.updateNpfValue();
    },500);*/
    console.log("Penis")
  }

  shutterData={
    focalLength:1200,
    pixelSize:23.6/6,
    aperture:208,
    declination:0
  }

  @ObservableProperty() npfValue:number=0;

  updateNpfValue(): void {

  }
  dfPropertyCommit(args:DataFormEventData):void{
    console.log("Penis")
    let fNumber=this.shutterData.focalLength/this.shutterData.aperture;
    const value=(16.856*fNumber+0.0997*this.shutterData.focalLength+13.713*this.shutterData.pixelSize)/(this.shutterData.focalLength*Math.cos(this.shutterData.declination/180*Math.PI));
    this.set("npfValue",value);
  }
}
