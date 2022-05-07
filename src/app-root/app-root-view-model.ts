import { Observable } from '@nativescript/core'
import { localize } from '@nativescript/localize'

import { ObservableProperty } from '../shared/observable-property-decorator'
import { SelectedPageService } from '../shared/selected-page-service'

export class AppRootViewModel extends Observable {
  @ObservableProperty() selectedPage: string

  constructor() {
    super()

    SelectedPageService.getInstance().selectedPage$.subscribe(
      (selectedPage: string) => (this.selectedPage = selectedPage)
    )
  }

  navigation:navItem[]=[
    {
      symbol:"\uf015",
      title:"home",
      nameShown:localize("home"),
      lineAbove:false
    },
    {
      symbol:"\uf013",
      title:"exposure",
      nameShown:localize("exposure"),
      lineAbove:false
    },
    {
      symbol:"\uf013",
      title:"settings",
      nameShown:localize("settings"),
      lineAbove:true
    },
    {
      symbol: String.fromCharCode(parseInt('f197', 16)),
      title:"telescopes",
      nameShown:localize("telescopeList"),
      lineAbove:true
    },
  ]

}


interface navItem{
  symbol:string;
  title:string;
  nameShown:string;
  lineAbove:boolean;
}