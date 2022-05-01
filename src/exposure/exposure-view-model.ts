import { Observable } from '@nativescript/core'
import { ObservableProperty } from '../shared/observable-property-decorator';;
import { Database } from "../services/database";
import { localize } from '@nativescript/localize';

import { SelectedPageService } from '../shared/selected-page-service'

export class ExposureViewModel extends Observable {
  constructor() {
    super();
    SelectedPageService.getInstance().updateSelectedPage('exposure');
    this.exposureData.camera=Database.getInstance().cameraList.map(x => x.name)[0];
    this.exposureData.telescope=Database.getInstance().telescopeList.map(x => x.name)[0];
    this.dfPropertyCommit();
  }

  exposureData = {
    focalLength: 0,
    fNumber:0,
    camera: "",
    telescope:"",
    declination: 0,
  }

  exposureMetadata = {
    isReadOnly: false,
    commitMode: 'Immediate',
    validationMode: 'Immediate',
    propertyAnnotations:
      [
        {
          name: 'camera',
          displayName: localize('cameraModule'),
          index: 0,
          editor: 'Picker',
          valuesProvider: Database.getInstance().cameraList.map(x => x.name)
        },
        {
          name: 'telescope',
          displayName: localize('telescope'),
          index: 1,
          editor: 'Picker',
          valuesProvider: Database.getInstance().telescopeList.map(x => x.name)
        },
        {
          name: 'focalLength',
          displayName: localize('focalLength'),
          index: 2,
          visible:false,
          editor: 'Label',
          editorParams: {
            minimum: 0,
            maximum: 20,
          }
        },
        {
          name: 'fNumber',
          displayName: localize('fNumber'),
          index: 3,
          editor: 'Label',
          editorParams: {
            minimum: 0,
            maximum: 20,
          }
        },
        {
          name: 'declination',
          displayName: localize('declination'),
          index: 4,
          editor: 'Slider',
          editorParams: {
            minimum: 0,
            maximum: 90,
          }
        },
      ]
  }

  @ObservableProperty() npfValue = "";
  @ObservableProperty() rule500 = "";
  @ObservableProperty() rule600 = "";

  dfPropertyCommit(): void {
    const camera = Database.getInstance().getCameraByName(this.exposureData.camera);
    const telescope=Database.getInstance().getTelescopeByName(this.exposureData.telescope);

    if(telescope.variableFocalLength){
      this.exposureMetadata.propertyAnnotations[2].editor='Slider';
      this.exposureMetadata.propertyAnnotations[2].editorParams.maximum=telescope.maxFocalLength;
      this.exposureMetadata.propertyAnnotations[2].editorParams.minimum=telescope.minFocalLength;
      if(this.exposureData.focalLength==0||this.exposureData.focalLength>telescope.maxFocalLength||this.exposureData.focalLength<telescope.minFocalLength){
        this.exposureData.focalLength=telescope.minFocalLength;
      }
    }else{
      this.exposureData.focalLength=telescope.focalLength;
    }
    const focalLength = this.exposureData.focalLength;

    if(telescope.variableFNumber){
      this.exposureMetadata.propertyAnnotations[3].editor='Slider';
      this.exposureMetadata.propertyAnnotations[3].editorParams.maximum=telescope.fNumberMax;
      this.exposureMetadata.propertyAnnotations[3].editorParams.minimum=telescope.fNumberMin;
      if(this.exposureData.fNumber==0||this.exposureData.fNumber>telescope.fNumberMax||this.exposureData.fNumber<telescope.fNumberMin){
        this.exposureData.fNumber=telescope.fNumberMin;
      }
    }else{
      this.exposureData.fNumber= focalLength / telescope.aperture;
    }

    const declination = this.exposureData.declination;
    const fNumber = this.exposureData.fNumber;

    const pixelSize = (camera.sensorSize.width / camera.pixelCount.width + camera.sensorSize.height / camera.pixelCount.height) * 500;
    const npfValue = (16.856 * fNumber + 0.0997 * focalLength + 13.713 * pixelSize) / (focalLength * Math.cos(declination / 180 * Math.PI));
    const rule500 = 500 / focalLength;
    const rule600 = 600 / focalLength;
    this.set("npfValue", Math.round(npfValue * 100) / 100 + " s");
    this.set("rule500", Math.round(rule500 * 100) / 100 + " s");
    this.set("rule600", Math.round(rule600 * 100) / 100 + " s");
  }
}
