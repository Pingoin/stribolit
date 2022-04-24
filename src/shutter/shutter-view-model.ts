import { Observable,fromObject } from '@nativescript/core'

import { SelectedPageService } from '../shared/selected-page-service'

export class ShutterViewModel extends Observable {
  constructor() {
    super()

    SelectedPageService.getInstance().updateSelectedPage('Settings')
    setInterval(()=>{
        this.set("date",new Date().toISOString());
    },500);
  }

    date= new Date().toISOString();
}
