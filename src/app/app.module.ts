import { Component, NgModule, OnDestroy } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { Observable, Subscription } from 'rxjs';
import { NgChartsModule } from 'ng2-charts';

import {
  IMqttMessage,
  MqttModule,
  IMqttServiceOptions,
  MqttService,
} from 'ngx-mqtt';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  //hostname: 'localhost',
  //port: 9001,
  //path: '/mqtt',
  //path: '',
  //url: 'ws://192.168.1.11:9001'
  hostname: 'test.mosquitto.org',
  protocol: 'ws',
  port: 8080,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

@Component({
  template: ` <h1></h1> `,
})
export class ExampleComponent implements OnDestroy {
  private subscription: Subscription;
  public message: string | undefined;

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService
      .observe('expulse')
      .subscribe((message: IMqttMessage) => {
        this.message = message.payload.toString();
      });
  }

  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true });
  }

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
