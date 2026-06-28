import { RouteInsight, TripConversation, WaynexPost } from "../types";

export const routeInsights: RouteInsight[] = [
  { id: "eta", label: "Smart ETA", value: "4h 18m", tone: "premium" },
  { id: "traffic", label: "Traffic Flow", value: "Clear after Murree", tone: "calm" },
  { id: "fuel", label: "Fuel Planner", value: "Stop in 82 km", tone: "alert" },
  { id: "weather", label: "Weather", value: "Light snow 7 PM", tone: "premium" },
];

export const routeFeed: WaynexPost[] = [
  {
    id: "1",
    kind: "Beautiful View",
    title: "Golden hour viewpoint is open",
    place: "Pir Sohawa Ridge",
    distance: "2.4 km",
    timeAgo: "12 min",
    visibility: "Public",
    coordinates: { latitude: 33.78, longitude: 73.07 },
    media: ["#10233f", "#1d735f", "#f7c46c"],
    likes: 284,
    comments: 31,
    shares: 17,
    saved: true,
  },
  {
    id: "2",
    kind: "Heavy Traffic",
    title: "Slow climb near toll plaza",
    place: "Murree Expressway",
    distance: "18 km",
    timeAgo: "24 min",
    visibility: "Trip",
    coordinates: { latitude: 33.9, longitude: 73.39 },
    media: ["#15171a", "#7d3e30", "#ffb15e"],
    likes: 96,
    comments: 14,
    shares: 8,
    saved: false,
  },
  {
    id: "3",
    kind: "Petrol Pump",
    title: "Premium fuel available, card accepted",
    place: "Bhurban Connector",
    distance: "41 km",
    timeAgo: "38 min",
    visibility: "Public",
    coordinates: { latitude: 33.95, longitude: 73.45 },
    media: ["#101820", "#255f85", "#9ee6d0"],
    likes: 141,
    comments: 19,
    shares: 12,
    saved: false,
  },
];

export const conversations: TripConversation[] = [
  {
    id: "c1",
    name: "Northern Loop Crew",
    lastMessage: "Ayesha shared live location for the convoy.",
    unread: 3,
    activeNow: true,
  },
  {
    id: "c2",
    name: "Hunza June Plan",
    lastMessage: "Hotel shortlist updated with breakfast filters.",
    unread: 0,
    activeNow: false,
  },
  {
    id: "c3",
    name: "Zain",
    lastMessage: "Voice note: road is clear after Abbottabad.",
    unread: 1,
    activeNow: true,
  },
];
