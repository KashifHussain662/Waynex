import { AuthProvider, AuthSession } from "../types";
import { ExploreDto, InboxDto, ProfileDto, RouteDashboardDto, SocialFeedDto } from "../dtos/waynexDtos";

export interface AuthRepository {
  signIn(provider: AuthProvider, identifier?: string): Promise<AuthSession>;
  registerWithEmail(email: string, password: string, displayName?: string): Promise<AuthSession>;
  sendPasswordReset(email: string): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  onAuthStateChanged(onSession: (session: AuthSession | null) => void): () => void;
  signOut(): Promise<void>;
}

export interface RouteRepository {
  getDashboard(destination: string): Promise<RouteDashboardDto>;
  subscribeDashboard?(destination: string, onData: (dashboard: RouteDashboardDto) => void): () => void;
}

export interface SocialRepository {
  getSocialFeed(): Promise<SocialFeedDto>;
  subscribeSocialFeed?(onData: (feed: SocialFeedDto) => void): () => void;
}

export interface ChatRepository {
  getInbox(): Promise<InboxDto>;
  subscribeInbox?(onData: (inbox: InboxDto) => void): () => void;
}

export interface ExploreRepository {
  getExplore(): Promise<ExploreDto>;
}

export interface ProfileRepository {
  getProfile(): Promise<ProfileDto>;
}
