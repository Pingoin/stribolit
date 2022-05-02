import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, NavigatedData, Page } from '@nativescript/core'

import { ExposureViewModel } from './exposure-view-model'
import { RadDataForm } from 'nativescript-ui-dataform';

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  const dataForm = page.getViewById('myDataForm') as RadDataForm;
  page.bindingContext = new ExposureViewModel(dataForm);;

}

export function onDrawerButtonTap(args: EventData) {
  const sideDrawer = <RadSideDrawer>Application.getRootView()
  sideDrawer.showDrawer()
}
