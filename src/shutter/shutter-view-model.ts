import { Observable,fromObject, GestureEventData } from '@nativescript/core'
import { DataFormEventData } from 'nativescript-ui-dataform';
import { ObservableProperty } from '../shared/observable-property-decorator';
import { CameraService } from '../services/camera.service';

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
    aperture:208,
    camera:"Generic",
    declination:0
  }
  shutterMetadata= {
    'isReadOnly': false,
    'commitMode': 'Immediate',
    'validationMode': 'Immediate',
    'propertyAnnotations':
    [
      {
        'name': 'camera',
        'displayName': 'Camera Module',
        'index': 0,
        'editor': 'Picker',
        valuesProvider:CameraService.getInstance().getCameras().map(x=>x.name)
      },
    ]
  }

  @ObservableProperty() npfValue:number=0;
  @ObservableProperty() cameraPixels:number=0;

  updateNpfValue(): void {

  }
  dfPropertyCommit(args:DataFormEventData):void{
    let fNumber=this.shutterData.focalLength/this.shutterData.aperture;
    const camera=CameraService.getInstance().getCameraByName(this.shutterData.camera);
    const pixelSize=(camera.sensorSize.width/camera.pixelCount.width+camera.sensorSize.height/camera.pixelCount.height)*500;

    const value=(16.856*fNumber+0.0997*this.shutterData.focalLength+13.713*pixelSize)/(this.shutterData.focalLength*Math.cos(this.shutterData.declination/180*Math.PI));
    this.set("npfValue",value);
  }
}
