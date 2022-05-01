import { Observable } from '@nativescript/core'
import { ObservableProperty } from '../shared/observable-property-decorator';;
import { Database } from "../services/database";

import { SelectedPageService } from '../shared/selected-page-service'

export class ExposureViewModel extends Observable {
  constructor() {
    super();
    SelectedPageService.getInstance().updateSelectedPage('exposure');
    this.exposureData.camera=Database.getInstance().cameraList.map(x => x.name)[0];
    this.dfPropertyCommit();
  }

  exposureData = {
    focalLength: 1200,
    aperture: 208,
    camera: "",
    declination: 0
  }

  exposureMetadata = {
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
    let fNumber = this.exposureData.focalLength / this.exposureData.aperture;
    const camera = Database.getInstance().getCameraByName(this.exposureData.camera);
    const focalLength = this.exposureData.focalLength;
    const declination = this.exposureData.declination;
    const pixelSize = (camera.sensorSize.width / camera.pixelCount.width + camera.sensorSize.height / camera.pixelCount.height) * 500;
    const npfValue = (16.856 * fNumber + 0.0997 * focalLength + 13.713 * pixelSize) / (focalLength * Math.cos(declination / 180 * Math.PI));
    const rule500 = 500 / focalLength;
    const rule600 = 600 / focalLength;
    this.set("npfValue", Math.round(npfValue * 100) / 100 + " s");
    this.set("rule500", Math.round(rule500 * 100) / 100 + " s");
    this.set("rule600", Math.round(rule600 * 100) / 100 + " s");
  }
}
