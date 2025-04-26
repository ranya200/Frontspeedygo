import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LeaveControllerService } from 'src/app/openapi';
/*import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  NgApexchartsModule
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};*/

interface DriverSummary {
  firstName: string;
  lastName: string;
  totalDaysTaken: number;
  limit: number;
}

@Component({
  selector: 'app-leave-summary',
  standalone: true,
  imports: [CommonModule, ],
  templateUrl: './leave-summary.component.html',
  styleUrls: ['./leave-summary.component.css']
})
export class LeaveSummaryComponent implements OnInit {
  summaries: DriverSummary[] = [];
  errorMessage = '';
  //chartOptions: ChartOptions | null = null;

  constructor(private leaveService: LeaveControllerService) {}

  ngOnInit(): void {
    this.fetchSummaries();
  }

  fetchSummaries(): void {
    this.leaveService.getSummaryByDriver().subscribe({
      next: async (res: any) => {
        if (res instanceof Blob) {
          const text = await res.text();
          this.summaries = JSON.parse(text);
        } else {
          this.summaries = res;
        }

        console.log('✅ Summaries loaded:', this.summaries);
        //this.prepareChart();
      },
      error: () => {
        this.errorMessage = 'Failed to load leave summaries.';
      }
    });
  }

  /*prepareChart(): void {
    const names = this.summaries.map(s => `${s.firstName} ${s.lastName}`);
    const values = this.summaries.map(s => s.totalDaysTaken);

    console.log('📊 Chart Data', names, values);

    this.chartOptions = {
      series: [
        {
          name: 'Days Taken',
          data: values
        }
      ],
      chart: {
        type: 'bar',
        height: 350
      },
      xaxis: {
        categories: names
      },
      title: {
        text: 'Leave Days Taken per Driver'
      }
    };
  }*/
}
