import { Color, Observable, Page } from '@nativescript/core'
import { ObservableProperty } from '../shared/observable-property-decorator';;
import { Database } from "../services/database";
import { localize } from '@nativescript/localize';

import { SelectedPageService } from '../shared/selected-page-service'
import { DataFormEventData, EntityProperty, RadDataForm } from 'nativescript-ui-dataform';

export class ExposureViewModel extends Observable {
  constructor(private dataForm: RadDataForm) {
    super();
    SelectedPageService.getInstance().updateSelectedPage('exposure');
    this.exposureData.camera = Database.getInstance().cameraList.map(x => x.name)[0];
    this.exposureData.telescope = Database.getInstance().telescopeList.map(x => x.name)[0];
    setTimeout(() => this.dfPropertyCommit(), 1000);
  }
  @ObservableProperty() exposureData = {
    focalLength: 0.5,
    fNumber: 0.5,
    camera: "",
    telescope: "",
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
          editor: 'Decimal'
        },
        {
          name: 'fNumber',
          displayName: localize('fNumber'),
          index: 3,
          editor: 'Decimal',
        },
        {
          name: 'declination',
          displayName: localize('declination'),
          index: 4,
          editor: 'Decimal',
          editorParams: {
            minimum: 0,
            maximum: 90,
          }
        },
      ]
  }

  resultMetadata = {
    isReadOnly: false,
    commitMode: 'Immediate',
    validationMode: 'Immediate',
    propertyAnnotations:
      [
        {
          name: 'npfValue',
          displayName: localize('npfRule'),
        },
        {
          name: 'rule500',
          displayName: localize('rule500'),
        },
        {
          name: 'rule600',
          displayName: localize('rule600'),
        },
      ]
  }

  @ObservableProperty() resultData: {
    npfValue: "",
    rule500: "",
    rule600: ""
  };

  lastTelescope = "";

  dfPropertyCommit(): void {
    const camera = Database.getInstance().getCameraByName(this.exposureData.camera);
    const telescope = Database.getInstance().getTelescopeByName(this.exposureData.telescope);
    let focalLength = this.exposureData.focalLength;
    let fNumber = this.exposureData.fNumber;

    if (this.lastTelescope != this.exposureData.telescope) {

      if (telescope.variableFocalLength) {
        const property = <EntityProperty>this.dataForm.getPropertyByName("focalLength");
        property.readOnly = false;
        if (focalLength == 0 || focalLength > telescope.maxFocalLength || focalLength < telescope.minFocalLength) {
          focalLength = telescope.minFocalLength;
        }
      } else {
        const property = <EntityProperty>this.dataForm.getPropertyByName("focalLength");
        property.readOnly = true;
        focalLength = telescope.focalLength;
      }

      if (telescope.variableFNumber) {
        const property = <EntityProperty>this.dataForm.getPropertyByName("fNumber");
        property.readOnly = false;
        if (fNumber == 0 || fNumber > telescope.fNumberMax || fNumber < telescope.fNumberMin) {
          fNumber = telescope.fNumberMin;
        }
      } else {
        const property = <EntityProperty>this.dataForm.getPropertyByName("fNumber");
        property.readOnly = true;
        fNumber = focalLength / telescope.aperture;
      }
      const newFormModel = { ...this.exposureData, fNumber: fNumber, focalLength: focalLength };
      this.set('exposureData', newFormModel);
      this.dataForm.reload();
      this.lastTelescope = this.exposureData.telescope
    }

    const declination = this.exposureData.declination;
    const pixelSize = (camera.sensorSize.width / camera.pixelCount.width + camera.sensorSize.height / camera.pixelCount.height) * 500;


    const npfValue = (16.856 * fNumber + 0.0997 * focalLength + 13.713 * pixelSize) / (focalLength * Math.cos(declination / 180 * Math.PI));
    const rule500 = 500 / focalLength;
    const rule600 = 600 / focalLength;

    let result = {
      npfValue: Math.round(npfValue * 100) / 100 + " s",
      rule500: Math.round(rule500 * 100) / 100 + " s",
      rule600: Math.round(rule600 * 100) / 100 + " s"
    };
    this.set("resultData", result);
  }

  dfPropertyValidate(args:DataFormEventData) {
    let validationResult=true;
    const telescope = Database.getInstance().getTelescopeByName(this.exposureData.telescope);
    let data=args.entityProperty as EntityProperty;

    switch (args.propertyName) {
      case 'focalLength':
        const focalLength=(data.valueCandidate as number);
        if ((focalLength>telescope.maxFocalLength || focalLength<telescope.minFocalLength )&& telescope.variableFocalLength){
          data.errorMessage=localize("the focal legth must be between %s and %s",telescope.minFocalLength.toString(),telescope.maxFocalLength.toString());
          validationResult = false;
        }
        break;
      case "fNumber":
        const fNumber=(data.valueCandidate as number);
        if((fNumber>telescope.fNumberMax||fNumber<telescope.fNumberMin)&&telescope.variableFNumber){
          data.errorMessage=localize("the fnumber must be between %s and %s",telescope.fNumberMin.toString(),telescope.fNumberMax.toString());
          validationResult = false;
        }
        if((fNumber<(this.exposureData.focalLength/telescope.aperture))&&telescope.variableFNumber){
          data.errorMessage=localize("the fnumber must be bigger than %s",(this.exposureData.focalLength/telescope.aperture).toString());
          validationResult = false;
        }

      break;
    }

    args.returnValue=validationResult;
  }

}
