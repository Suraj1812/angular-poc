import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { SurveyService } from "../../survey/services/survey.service";
import { Survey } from "../../../core/models/survey.model";

@Injectable({ providedIn: "root" })
export class DashboardService {
  constructor(private surveyService: SurveyService) {}

  getDashboardData(tenantId: string): Observable<any> {
    return this.surveyService.getSurveys(tenantId).pipe(
      map((surveys: Survey[]) => {
        const totalSurveys = surveys.length;
        const totalResponses = surveys.reduce(
          (a, b) => a + (b.responseCount || 0),
          0,
        );

        const participationRate = totalSurveys
          ? Math.round((totalResponses / (totalSurveys * 50)) * 100)
          : 0;

        const labels = surveys.map((s) => s.name);
        const inside = surveys.map((s) => s.responseCount || 0);
        const outside = surveys.map(() => Math.floor(Math.random() * 50));

        return {
          totalSurveys,
          totalResponses,
          participationRate,
          labels,
          inside,
          outside,
        };
      }),
    );
  }
}
