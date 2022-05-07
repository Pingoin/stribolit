import { fromObject, Observable, ObservableArray } from '@nativescript/core';
import { Database } from '../services/database';
import { Telescope } from '../models/telescope.model';

import { SelectedPageService } from '../shared/selected-page-service'
import { ObservableProperty } from '../shared/observable-property-decorator';

export class TelescopeEditViewModel extends Observable {
  constructor(private _context: { telescope: string }) {
    super();

    SelectedPageService.getInstance().updateSelectedPage('telescopes');
    this.telescope=Database.getInstance().getTelescopeByName(_context.telescope);
  }

  @ObservableProperty()  telescope:Telescope;


}
