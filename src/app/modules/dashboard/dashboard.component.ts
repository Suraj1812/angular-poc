import { Component, AfterViewInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DashboardService } from "./services/dashboard.service";

declare var Chart: any;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  totalSurveys = 0;
  totalResponses = 0;
  participationRate = 0;
  chart: any;
  tenantId: string;

  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    if (this.route.parent) {
      this.tenantId = this.route.parent.snapshot.paramMap.get("tenantId");
    }

    this.loadRealData();
  }

  loadRealData() {
    this.dashboardService.getDashboardData(this.tenantId).subscribe((data) => {
      this.totalSurveys = data.totalSurveys;
      this.totalResponses = data.totalResponses;
      this.participationRate = data.participationRate;
      this.renderRadarChart(data.labels, data.inside, data.outside);
    });
  }

  generateFakeData() {
    const labels = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];

    const inside = labels.map(() => Math.floor(Math.random() * 50));
    const outside = labels.map(() => Math.floor(Math.random() * 50));

    this.renderRadarChart(labels, inside, outside);
  }

  renderRadarChart(labels: string[], inside: number[], outside: number[]) {
    if (this.chart) {
      this.chart.destroy();
    }

    const maxInsideIndex = inside.indexOf(Math.max(...inside));
    const maxOutsideIndex = outside.indexOf(Math.max(...outside));

    const highlightPlugin = {
      beforeDraw: function (chart) {
        const ctx = chart.chart.ctx;
        const scale = chart.scale;

        if (!scale) return;

        const centerX = scale.xCenter;
        const centerY = scale.yCenter;
        const radius = scale.drawingArea;
        const angleStep = (Math.PI * 2) / labels.length;

        ctx.save();
        ctx.globalAlpha = 0.15;

        // 🔵 Inside view highlight
        ctx.fillStyle = "#00b4c8";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          angleStep * maxInsideIndex - Math.PI / 2,
          angleStep * (maxInsideIndex + 1) - Math.PI / 2,
        );
        ctx.closePath();
        ctx.fill();

        // 🔴 Outside view highlight
        ctx.fillStyle = "#ff0078";
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(
          centerX,
          centerY,
          radius,
          angleStep * maxOutsideIndex - Math.PI / 2,
          angleStep * (maxOutsideIndex + 1) - Math.PI / 2,
        );
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      },
    };

    this.chart = new Chart("radarChart", {
      type: "radar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Inside view",
            data: inside,
            backgroundColor: "rgba(0,180,200,0.2)",
            borderColor: "#00b4c8",
            pointBackgroundColor: "#00b4c8",
            borderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: "Outside view",
            data: outside,
            backgroundColor: "rgba(255,0,120,0.2)",
            borderColor: "#ff0078",
            pointBackgroundColor: "#ff0078",
            borderWidth: 4,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scale: {
          ticks: {
            display: false,
            min: 0,
            max: 50,
          },
          gridLines: {
            color: "#ddd",
            lineWidth: 1.5,
          },
          angleLines: {
            color: "#ddd",
            lineWidth: 1.5,
          },
          pointLabels: {
            fontSize: 14,
          },
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: "SHOW MAXIMUM DEVIATION",
          fontSize: 22,
          fontColor: "#ff0078",
        },
      },
      plugins: [highlightPlugin],
    });
  }

  ngOnDestroy() {
    if (this.chart) this.chart.destroy();
  }
}
