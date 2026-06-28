import { conversations, routeFeed, routeInsights } from "../constants/mockData";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getRouteDashboard() {
  await pause(280);
  return {
    insights: routeInsights,
    feed: routeFeed,
    weather: {
      condition: "Crisp air",
      temperature: "14 C",
      wind: "9 km/h",
    },
  };
}

export async function getConversations() {
  await pause(220);
  return conversations;
}
