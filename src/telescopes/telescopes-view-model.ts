import { Frame, ItemEventData, Observable, ObservableArray } from '@nativescript/core'
import { Database } from '../services/database'
import { Telescope } from '../models/telescope.model'

import { SelectedPageService } from '../shared/selected-page-service'

export class TelescopesViewModel extends Observable {
  constructor() {
    super();

    SelectedPageService.getInstance().updateSelectedPage('telescopes');

    this._telescopes=Database.getInstance().telescopeList;
  }
  private _telescopes:Telescope[];

  get telescopes():ObservableArray<Telescope>{
    return new ObservableArray(this._telescopes);
  }

  onItemTap(args: ItemEventData) {
    const telescopeName= this._telescopes[args.index].name;
    Frame.topmost().navigate({
      moduleName: 'telescope-edit/telescope-edit-page',
      context: { telescope: telescopeName}
    })
  }
}
