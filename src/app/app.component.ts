import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { IMqttMessage, MqttService } from 'ngx-mqtt';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';

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
  nivelAgua: number[] = [10, 18];
  number: number = 0;
  tabla: boolean = false;

  constructor(private _mqttService: MqttService) {
    Chart.register(Annotation)
  }

  ngOnInit(): void {
    this.subscribeNewTopic();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  subscribeNewTopic(): void {
    var enc = new TextDecoder("utf-8");
    this.subscription = this._mqttService
      .observe('chiku/team/levelWater')
      .subscribe((message: any) => {
        var arr = new Uint8Array(message['payload']);
        this.number = Number(enc.decode(arr));
        this.nivelAgua.push(this.number);
        this.tabla = true;
        this.chart?.update();
        // if (this.nivelAgua.length == 30) {
        //   this.chart?.update();
        // }
      });
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


  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: this.nivelAgua,
        label: 'Nivel de agua en Tanque',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      }
    ],
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5
      }
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      x: {},
      'y-axis-0':
      {
        position: 'left',
      },
      'y-axis-1': {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red'
        }
      }
    },
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

}
