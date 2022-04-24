import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, EventData, NavigatedData, Page } from '@nativescript/core'

import { ShutterViewModel } from './shutter-view-model'

export function onNavigatingTo(args: NavigatedData) {
  const page = <Page>args.object
  page.bindingContext = new ShutterViewModel()
}

export function onDrawerButtonTap(args: EventData) {
  const sideDrawer = <RadSideDrawer>Application.getRootView()
  sideDrawer.showDrawer()
}
