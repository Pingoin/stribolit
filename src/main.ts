import { Application } from '@nativescript/core'

import { localize } from '@nativescript/localize'
Application.setResources({ L: localize })

Application.run({ moduleName: 'app-root/app-root' })

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
