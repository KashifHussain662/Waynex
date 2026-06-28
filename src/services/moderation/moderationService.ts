import { firestoreService } from "../firebase";

export type ReportReason = "spam" | "harassment" | "unsafe-advice" | "sensitive-content" | "misinformation" | "other";

export type ModerationReport = {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: "post" | "user" | "story" | "comment";
  reason: ReportReason;
  details?: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
};

export const moderationService = {
  async report(input: Omit<ModerationReport, "id" | "status" | "createdAt">) {
    const report: ModerationReport = {
      ...input,
      id: `report-${Date.now()}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    await firestoreService.upsert("reports", report.id, report);
    return report;
  },
  async blockUser(userId: string, blockedUserId: string) {
    return firestoreService.upsert(`users/${userId}/blockedUsers`, blockedUserId, {
      blockedUserId,
      createdAt: new Date().toISOString(),
    });
  },
  async muteUser(userId: string, mutedUserId: string) {
    return firestoreService.upsert(`users/${userId}/mutedUsers`, mutedUserId, {
      mutedUserId,
      createdAt: new Date().toISOString(),
    });
  },
};
