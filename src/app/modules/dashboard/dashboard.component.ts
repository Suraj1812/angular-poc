import {
  Component,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DashboardService } from "./services/dashboard.service";
import { AuthService } from "src/app/core/services/auth.service";
import { Permission } from "src/app/core/models/permission.model";

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
  topSurveys: any[] = [];
  dailyResponses: any[] = [];
  chart: any;
  lineChart: any;
  tenantId: string;
  startDate: string;
  endDate: string;
  showCustomRange = false;
  dateRange = "7days";
  loading = false;
  exporting = false;
  canExport = false;
  mockMode = false;
  hasData = false;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit() {
    if (this.route.parent) {
      const paramMap = this.route.parent.snapshot.paramMap;
      this.tenantId = paramMap.get("tenantId");
    }

    this.canExport = this.authService.hasPermission(
      Permission.DASHBOARD_EXPORT,
    );
    this.setDefaultDates();
    this.showEmptyDashboard();
  }

  showEmptyDashboard() {
    this.hasData = false;
    this.mockMode = false;
    this.totalSurveys = 0;
    this.totalResponses = 0;
    this.participationRate = 0;
    this.topSurveys = [];
    this.dailyResponses = [];

    const emptyLabels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const emptyData = emptyLabels.map(() => 0);

    this.renderRadarChart(emptyLabels, emptyData, emptyData);

    const emptyDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const emptyDailyResponses = emptyDays.map((day) => ({
      date: day,
      count: 0,
    }));
    this.renderLineChart(emptyDailyResponses);
  }

  setDefaultDates() {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    this.startDate = this.formatDate(start);
    this.endDate = this.formatDate(end);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  onDateRangeChange(range: string) {
    this.dateRange = range;
    if (range === "7days") {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.showCustomRange = false;
      if (this.hasData) {
        this.loadDashboardData();
      }
    } else if (range === "30days") {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      this.startDate = this.formatDate(start);
      this.endDate = this.formatDate(end);
      this.showCustomRange = false;
      if (this.hasData) {
        this.loadDashboardData();
      }
    } else if (range === "custom") {
      this.showCustomRange = true;
    }
  }

  applyCustomDateRange() {
    if (this.startDate && this.endDate && this.hasData) {
      this.loadDashboardData();
    }
  }

  loadDashboardData() {
    this.loading = true;
    this.mockMode = false;

    if (this.dateRange === "custom" && this.startDate && this.endDate) {
      this.dashboardService
        .getFilteredDashboardData(this.tenantId, this.startDate, this.endDate)
        .subscribe(this.handleDataResponse.bind(this));
    } else {
      this.dashboardService
        .getDashboardData(this.tenantId)
        .subscribe(this.handleDataResponse.bind(this));
    }
  }

  generateMockData() {
    this.mockMode = true;
    this.hasData = true;
    this.loading = true;

    const mockData = this.generateRandomMockData();

    setTimeout(() => {
      this.handleDataResponse(mockData);
      this.cdr.detectChanges();
    }, 800);
  }

  generateRandomMockData() {
    const surveyNames = [
      "Employee Satisfaction Survey Q4",
      "Customer Feedback Analysis 2025",
      "Product Usability Testing Results",
      "Annual Training Program Evaluation",
      "Remote Work Experience Survey",
      "Team Collaboration Effectiveness",
      "New Hire Onboarding Feedback",
      "Employee Benefits Satisfaction",
      "Company Culture & Values Assessment",
      "Technology & Tools Usage Feedback",
    ];

    const totalSurveys = this.getRandomInt(45, 185);
    const totalResponses = this.getRandomInt(1200, 8500);
    const participationRate = this.getRandomInt(42, 92);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const inside = months.map(() => this.getRandomInt(18, 52));
    const outside = months.map(() => this.getRandomInt(18, 52));

    const shuffledNames = [...surveyNames].sort(() => Math.random() - 0.5);
    const topSurveys = shuffledNames
      .slice(0, 5)
      .map((name) => ({
        name,
        responseCount: this.getRandomInt(420, 2350),
      }))
      .sort((a, b) => b.responseCount - a.responseCount);

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const dailyResponses = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      return {
        date: day + " " + date.getDate().toString().padStart(2, "0"),
        count: this.getRandomInt(180, 720),
      };
    });

    return {
      totalSurveys,
      totalResponses,
      participationRate,
      labels: months,
      inside,
      outside,
      topSurveys,
      dailyResponses,
    };
  }

  getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  handleDataResponse(data: any) {
    this.totalSurveys = data.totalSurveys;
    this.totalResponses = data.totalResponses;
    this.participationRate = data.participationRate;
    this.topSurveys = data.topSurveys;
    this.dailyResponses = data.dailyResponses;
    this.renderRadarChart(data.labels, data.inside, data.outside);
    this.renderLineChart(data.dailyResponses);
    this.loading = false;
    this.hasData = true;
    this.cdr.detectChanges();
  }

  exportData() {
    if (!this.hasData) return;

    this.exporting = true;
    let startDate, endDate;
    if (this.dateRange === "custom" && this.startDate && this.endDate) {
      startDate = this.startDate;
      endDate = this.endDate;
    }
    this.dashboardService
      .exportDashboardData(this.tenantId, startDate, endDate)
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "dashboard_export_" + new Date().getTime() + ".csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.exporting = false;
        this.cdr.detectChanges();
      });
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
        ctx.fillStyle = "rgba(59, 130, 246, 0.3)";
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
        ctx.fillStyle = "rgba(236, 72, 153, 0.3)";
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
            label: "Engagement Score",
            data: inside,
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            borderColor: "#3b82f6",
            pointBackgroundColor: "#3b82f6",
            borderWidth: 3,
            pointRadius: inside[0] === 0 ? 0 : 6,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "#1d4ed8",
          },
          {
            label: "Response Rate",
            data: outside,
            backgroundColor: "rgba(236, 72, 153, 0.1)",
            borderColor: "#ec4899",
            pointBackgroundColor: "#ec4899",
            borderWidth: 3,
            pointRadius: outside[0] === 0 ? 0 : 6,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "#be185d",
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
            max: Math.max(...inside, ...outside) > 0 ? 50 : 10,
          },
          gridLines: {
            color: "rgba(209, 213, 219, 0.8)",
            lineWidth: 1.5,
          },
          angleLines: {
            color: "rgba(209, 213, 219, 0.8)",
            lineWidth: 1.5,
          },
          pointLabels: {
            fontSize: 12,
            fontColor: "#6b7280",
            fontStyle: "600",
          },
        },
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            padding: 20,
            fontColor: "#374151",
            fontStyle: "600",
          },
        },
        title: {
          display: true,
          text:
            inside[0] === 0
              ? "NO DATA AVAILABLE"
              : "SURVEY PERFORMANCE ANALYSIS",
          fontSize: 16,
          fontColor: inside[0] === 0 ? "#94a3b8" : "#374151",
          fontStyle: "600",
          padding: 20,
        },
      },
      plugins: inside[0] === 0 ? [] : [highlightPlugin],
    });
  }

  renderLineChart(dailyData: any[]) {
    if (this.lineChart) {
      this.lineChart.destroy();
    }
    const ctx = document.getElementById("lineChart") as HTMLCanvasElement;
    if (!ctx) return;

    const hasData = dailyData.some((d) => d.count > 0);

    this.lineChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dailyData.map((d) => d.date),
        datasets: [
          {
            label: "Daily Responses",
            data: dailyData.map((d) => d.count),
            borderColor: hasData ? "#10b981" : "#cbd5e1",
            backgroundColor: hasData
              ? "rgba(16, 185, 129, 0.1)"
              : "rgba(203, 213, 225, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: hasData ? "#10b981" : "#cbd5e1",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            pointRadius: hasData ? 5 : 0,
            pointHoverRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(209, 213, 219, 0.5)",
            },
            ticks: {
              stepSize: 100,
              fontColor: "#6b7280",
              fontStyle: "500",
            },
          },
          x: {
            grid: {
              color: "rgba(209, 213, 219, 0.5)",
            },
            ticks: {
              fontColor: "#6b7280",
              fontStyle: "500",
            },
          },
        },
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              fontColor: "#374151",
              fontStyle: "600",
              usePointStyle: true,
            },
          },
          title: {
            display: true,
            text: hasData ? "DAILY RESPONSE TREND" : "NO DATA COLLECTED",
            font: {
              size: 16,
              weight: "600",
            },
            color: hasData ? "#374151" : "#94a3b8",
            padding: {
              top: 10,
              bottom: 30,
            },
          },
        },
      },
    });
  }

  ngOnDestroy() {
    if (this.chart) this.chart.destroy();
    if (this.lineChart) this.lineChart.destroy();
  }
}
