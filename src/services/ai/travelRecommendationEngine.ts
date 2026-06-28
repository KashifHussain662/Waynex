import { RouteRecommendation, WaynexPost } from "../../types";

export type TravelRecommendationContext = {
  userId: string;
  interests: string[];
  previousTrips: string[];
  destination: string;
  weather?: string;
  reports: WaynexPost[];
  season?: string;
};

export interface LlmRecommendationProvider {
  recommend(context: TravelRecommendationContext): Promise<RouteRecommendation[]>;
}

export class RuleBasedTravelRecommendationProvider implements LlmRecommendationProvider {
  async recommend(context: TravelRecommendationContext): Promise<RouteRecommendation[]> {
    const hasSafetyReport = context.reports.some((report) =>
      ["Road Closed", "Heavy Traffic", "Flood", "Landslide", "Snowfall", "Emergency", "Warning"].includes(report.kind),
    );

    return [
      {
        id: `ai-safe-${context.destination}`,
        mode: "Safer",
        title: hasSafetyReport ? "Review safer route before departure" : "Start with current safest route",
        reason: `${context.destination} scored against reports, weather, interests and trip history.`,
        impact: hasSafetyReport ? "Reduces route risk" : "Best current balance",
      },
    ];
  }
}

export const travelRecommendationEngine = {
  provider: new RuleBasedTravelRecommendationProvider() as LlmRecommendationProvider,
  configure(provider: LlmRecommendationProvider) {
    this.provider = provider;
  },
  recommend(context: TravelRecommendationContext) {
    return this.provider.recommend(context);
  },
};
