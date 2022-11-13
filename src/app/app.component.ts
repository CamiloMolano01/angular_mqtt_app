import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular_mqtt_app';
  private subscription!: Subscription;
  topicname: any;
  msg: any;
  isConnected: boolean = false;
  @ViewChild('msglog', { static: true })
  msglog!: ElementRef;

  constructor(private _mqttService: MqttService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeNewTopic(): void {
    console.log('inside subscribe new topic');
    this.subscription = this._mqttService
      .observe(this.topicname)
      .subscribe((message: IMqttMessage) => {
        this.msg = message;
        console.log('msg: ', message);
        this.logMsg(
          'Message: ' +
            message.payload.toString() +
            '<br> for topic: ' +
            message.topic
        );
      });
    this.logMsg('subscribed to topic: ' + this.topicname);
  }

  sendmsg(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish(this.topicname, this.msg, {
      qos: 1,
      retain: true,
    });
    this.msg = '';
  }

  send1Action(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish('chiku/team/expulse', '3', {
      qos: 1,
      retain: true,
    });
    this.msg = '';
    this.logMsg('cualquiera');
  }

  send2Action(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish('chiku/team/move', '5', {
      qos: 1,
      retain: true,
    });
    this.msg = '';
  }

  send3Action(): void {
    // use unsafe publish for non-ssl websockets
    this._mqttService.unsafePublish('chiku/team/llave', '7', {
      qos: 1,
      retain: true,
    });
    this.msg = '';
  }

  logMsg(message: string): void {
    this.msglog.nativeElement.innerHTML += '<br><hr>' + message;
  }

  clear(): void {
    this.msglog.nativeElement.innerHTML = '';
  }
}
