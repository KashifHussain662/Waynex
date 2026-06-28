import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, limit, orderBy, query as firestoreQuery, where } from "firebase/firestore";
import { httpClient } from "../../api/httpClient";
import { getWaynexFirestore } from "../firebase";

export type SearchCategory = "users" | "destinations" | "hotels" | "restaurants" | "trips" | "posts" | "stories" | "hashtags";

export type SearchFilters = {
  category?: SearchCategory;
  destination?: string;
  radiusKm?: number;
  verifiedOnly?: boolean;
};

export type SearchResult = {
  id: string;
  category: SearchCategory;
  title: string;
  subtitle?: string;
  score: number;
};

const RECENT_SEARCHES_KEY = "waynex:recent-searches";

function scoreText(value: string, query: string) {
  const normalizedValue = value.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  if (normalizedValue === normalizedQuery) {
    return 100;
  }
  if (normalizedValue.startsWith(normalizedQuery)) {
    return 85;
  }
  return normalizedValue.includes(normalizedQuery) ? 65 : 0;
}

async function firestoreSearch(searchQuery: string, filters: SearchFilters) {
  const db = getWaynexFirestore();
  const term = searchQuery.trim().toLowerCase();
  if (!db || !term) {
    return [];
  }

  const results: SearchResult[] = [];
  const include = (category: SearchCategory) => !filters.category || filters.category === category;

  if (include("users")) {
    const snapshot = await getDocs(firestoreQuery(collection(db, "users"), orderBy("username"), limit(25)));
    snapshot.docs.forEach((item) => {
      const user = item.data();
      const title = String(user.displayName ?? user.username ?? "");
      const score = Math.max(scoreText(title, term), scoreText(String(user.username ?? ""), term));
      if (score) {
        results.push({ id: item.id, category: "users", title, subtitle: user.country, score });
      }
    });
  }

  if (include("posts") || include("hashtags")) {
    const snapshot = await getDocs(firestoreQuery(collection(db, "posts"), where("searchKeywords", "array-contains", term), limit(30)));
    snapshot.docs.forEach((item) => {
      const post = item.data();
      results.push({ id: item.id, category: "posts", title: String(post.text ?? "Post"), subtitle: post.destination, score: 90 });
      (post.hashtags ?? []).forEach((tag: string) => {
        if (include("hashtags") && tag.includes(term)) {
          results.push({ id: tag, category: "hashtags", title: `#${tag}`, score: 80 });
        }
      });
    });
  }

  await Promise.all(
    ([
      ["trips", "trips"],
      ["hotels", "hotels"],
      ["places", "destinations"],
      ["stories", "stories"],
    ] as const).map(async ([collectionName, category]) => {
      if (!include(category)) {
        return;
      }

      const snapshot = await getDocs(firestoreQuery(collection(db, collectionName), limit(25)));
      snapshot.docs.forEach((item) => {
        const value = item.data();
        const title = String(value.title ?? value.name ?? value.destinationName ?? value.text ?? "");
        const score = scoreText(title, term);
        if (score) {
          results.push({
            id: item.id,
            category,
            title,
            subtitle: value.description ?? value.destinationName ?? value.location?.address,
            score,
          });
        }
      });
    }),
  );

  return results.sort((a, b) => b.score - a.score).slice(0, 40);
}

export const searchService = {
  async search(query: string, filters: SearchFilters = {}) {
    await this.saveRecent(query);
    const localResults = await firestoreSearch(query, filters);
    if (localResults.length) {
      return localResults;
    }
    return httpClient.post<SearchResult[]>("/search", { query, filters }).catch(() => []);
  },
  async suggestions(query: string) {
    const recent = await this.getRecent();
    const local = recent.filter((item) => item.toLowerCase().includes(query.toLowerCase())).slice(0, 5);
    if (local.length) {
      return local;
    }
    return httpClient.get<string[]>(`/search/suggestions?q=${encodeURIComponent(query)}`).catch(() => []);
  },
  async getRecent() {
    const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  },
  async saveRecent(query: string) {
    if (!query.trim()) {
      return;
    }

    const recent = await this.getRecent();
    const next = [query, ...recent.filter((item) => item !== query)].slice(0, 10);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
  },
};
