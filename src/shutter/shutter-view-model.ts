import { Observable } from '@nativescript/core'
import { ObservableProperty } from '../shared/observable-property-decorator';;
import { Database } from "../services/database";

import { SelectedPageService } from '../shared/selected-page-service'

export class ShutterViewModel extends Observable {
  constructor() {
    super();
    SelectedPageService.getInstance().updateSelectedPage('shutter');
    this.shutterData.camera=Database.getInstance().cameraList.map(x => x.name)[0];
    this.dfPropertyCommit();
  }

  shutterData = {
    focalLength: 1200,
    aperture: 208,
    camera: "",
    declination: 0
  }

  shutterMetadata = {
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
          'valuesProvider': Database.getInstance().cameraList.map(x => x.name)
        },
      ]
  }

  @ObservableProperty() npfValue = "";
  @ObservableProperty() rule500 = "";
  @ObservableProperty() rule600 = "";

  dfPropertyCommit(): void {
    let fNumber = this.shutterData.focalLength / this.shutterData.aperture;
    const camera = Database.getInstance().getCameraByName(this.shutterData.camera);
    const focalLength = this.shutterData.focalLength;
    const declination = this.shutterData.declination;
    const pixelSize = (camera.sensorSize.width / camera.pixelCount.width + camera.sensorSize.height / camera.pixelCount.height) * 500;
    const npfValue = (16.856 * fNumber + 0.0997 * focalLength + 13.713 * pixelSize) / (focalLength * Math.cos(declination / 180 * Math.PI));
    const rule500 = 500 / focalLength;
    const rule600 = 600 / focalLength;
    this.set("npfValue", Math.round(npfValue * 100) / 100 + " s");
    this.set("rule500", Math.round(rule500 * 100) / 100 + " s");
    this.set("rule600", Math.round(rule600 * 100) / 100 + " s");
  }
}
