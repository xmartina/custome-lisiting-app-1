import {ApplicationRef, ComponentFactoryResolver, Injectable, Injector} from '@angular/core';


// https://stackoverflow.com/questions/45091330/how-to-spawn-angular-4-component-inside-a-leaflet-markers-popup
@Injectable()
export class CustomCompileService {

    private appRef: ApplicationRef;

    constructor(
        private injector: Injector,
        private resolver: ComponentFactoryResolver
    ) { }

    configure(appRef) {
        this.appRef = appRef;
    }

    compile(component, onAttach) {
        const compFactory = this.resolver.resolveComponentFactory(component);
        let compRef = compFactory.create(this.injector);

        if (onAttach)
            onAttach(compRef);

        this.appRef.attachView(compRef.hostView);
        compRef.onDestroy(() => this.appRef.detachView(compRef.hostView));

        let div = document.createElement('div');
        div.appendChild(compRef.location.nativeElement);
        return div;
    }

}