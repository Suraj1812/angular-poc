import { Injectable } from "@angular/core";
import { Observable, of, BehaviorSubject } from "rxjs";
import { Survey } from "../../../core/models/survey.model";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  private surveysSubject = new BehaviorSubject<Survey[]>([]);
  surveys$ = this.surveysSubject.asObservable();

  private surveysData: Survey[] = [
    {
      id: 1,
      name: "Employee Satisfaction Survey",
      description: "Measure employee satisfaction levels",
      status: "published",
      createdDate: new Date("2024-01-15"),
      responseCount: 45,
      tenantId: "tenant1",
      questions: [
        {
          id: 1,
          text: "How satisfied are you with your work?",
          type: "single-choice",
          required: true,
          options: [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied",
          ],
        },
        {
          id: 2,
          text: "What improvements would you suggest?",
          type: "text",
          required: false,
        },
      ],
    },
    {
      id: 2,
      name: "Product Feedback",
      description: "Collect feedback about our products",
      status: "draft",
      createdDate: new Date("2024-02-01"),
      responseCount: 0,
      tenantId: "tenant1",
      questions: [
        {
          id: 1,
          text: "Rate the product quality",
          type: "single-choice",
          required: true,
          options: ["Excellent", "Good", "Average", "Poor"],
        },
      ],
    },
    {
      id: 3,
      name: "Training Program Feedback",
      description: "Feedback about training programs",
      status: "published",
      createdDate: new Date("2024-01-20"),
      responseCount: 32,
      tenantId: "tenant2",
      questions: [],
    },
  ];

  getSurveys(tenantId: string): Observable<Survey[]> {
    const tenantSurveys = this.surveysData.filter(
      (s) => s.tenantId === tenantId,
    );
    this.surveysSubject.next(tenantSurveys);
    return of(tenantSurveys);
  }

  getSurvey(tenantId: string, id: number): Observable<Survey> {
    const survey = this.surveysData.find(
      (s) => s.tenantId === tenantId && s.id === id,
    );
    return of(survey);
  }

  createSurvey(tenantId: string, survey: Partial<Survey>): Observable<Survey> {
    const newSurvey: Survey = {
      id: this.generateId(),
      ...(survey as Survey),
    };

    this.surveysData.push(newSurvey);
    this.surveysSubject.next([...this.surveysData]);
    return of(newSurvey);
  }

  updateSurvey(
    tenantId: string,
    id: number,
    survey: Partial<Survey>,
  ): Observable<Survey> {
    const index = this.surveysData.findIndex(
      (s) => s.tenantId === tenantId && s.id === id,
    );
    if (index > -1) {
      this.surveysData[index] = { ...this.surveysData[index], ...survey };
      this.surveysSubject.next([...this.surveysData]);
      return of(this.surveysData[index]);
    }
    return of(null);
  }

  private generateId(): number {
    return Math.max(...this.surveysData.map((s) => s.id), 0) + 1;
  }
}
