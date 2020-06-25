import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  title = 'Sistema de configuração do aplicativo CheckApp';

  // @HostListener('window:unload', [ '$event' ])
  // unloadHandler(event) {
  //   event.returnValue = "Are you sure?";
  // }

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event) {
    
  //   event.returnValue = "Are you sure?";
  // }
}
