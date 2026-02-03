import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { SurveyService } from "../../survey/services/survey.service";
import { Survey } from "../../../core/models/survey.model";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(private surveyService: SurveyService) {}

  getDashboardData(tenantId: string): Observable<any> {
    return this.surveyService
      .getSurveys(tenantId)
      .pipe(
        map((surveys: Survey[]) => this.generateRandomDashboardData(surveys)),
      );
  }

  getFilteredDashboardData(
    tenantId: string,
    startDate: string,
    endDate: string,
  ): Observable<any> {
    return this.surveyService.getSurveys(tenantId).pipe(
      map((surveys: Survey[]) => {
        const filteredSurveys = surveys.filter((survey) => {
          const surveyDate = new Date(survey.createdDate);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return surveyDate >= start && surveyDate <= end;
        });
        return this.generateRandomDashboardData(filteredSurveys);
      }),
    );
  }

  private generateRandomDashboardData(surveys: Survey[]) {
    const surveyNames = [
      "Employee Engagement Q1",
      "Customer Satisfaction",
      "Product Feedback",
      "Training Evaluation",
      "WFH Experience",
      "Team Collaboration",
      "Onboarding Review",
      "Benefits Survey",
    ];

    const totalSurveys = surveys.length || this.getRandomInt(30, 150);
    const totalResponses =
      surveys.reduce((a, b) => a + (b.responseCount || 0), 0) ||
      this.getRandomInt(800, 5000);
    const participationRate = totalSurveys
      ? Math.round((totalResponses / (totalSurveys * 100)) * 100)
      : this.getRandomInt(35, 90);

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
    const inside = months.map(() => this.getRandomInt(10, 48));
    const outside = months.map(() => this.getRandomInt(10, 48));

    const shuffledNames = [...surveyNames].sort(() => Math.random() - 0.5);
    const topSurveys = shuffledNames.slice(0, 5).map((name) => ({
      name,
      responseCount: this.getRandomInt(300, 2000),
    }));

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const dailyResponses = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - index));
      return {
        date: day + " " + date.getDate(),
        count: this.getRandomInt(150, 650),
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

  private getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  exportDashboardData(
    tenantId: string,
    startDate?: string,
    endDate?: string,
  ): Observable<Blob> {
    const csvContent = this.generateRandomCSVContent(startDate, endDate);
    const blob = new Blob([csvContent], { type: "text/csv" });
    return of(blob);
  }

  private generateRandomCSVContent(
    startDate?: string,
    endDate?: string,
  ): string {
    let csv = "Dashboard Analytics Report\n";
    if (startDate && endDate) {
      csv += `Date Range: ${startDate} to ${endDate}\n`;
    }
    csv += `Report Generated: ${new Date().toLocaleDateString()}\n\n`;

    csv += "Summary Metrics\n";
    csv += "Metric,Value\n";
    csv += `Total Surveys,${this.getRandomInt(30, 150)}\n`;
    csv += `Total Responses,${this.getRandomInt(800, 5000)}\n`;
    csv += `Participation Rate,${this.getRandomInt(35, 90)}%\n\n`;

    csv += "Daily Response Count\n";
    csv += "Date,Responses\n";

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = this.getRandomInt(150, 650);
      csv += `${dateStr},${count}\n`;
    }

    csv += "\nTop Surveys\n";
    csv += "Survey Name,Responses\n";

    const surveyNames = [
      "Employee Engagement",
      "Customer Feedback",
      "Product Testing",
      "Training Evaluation",
      "WFH Survey",
    ];
    surveyNames.forEach((name) => {
      csv += `${name},${this.getRandomInt(300, 2000)}\n`;
    });

    return csv;
  }
}
