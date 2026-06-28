export type AdminEntityType =
  | "user"
  | "post"
  | "story"
  | "trip"
  | "destination"
  | "hotel"
  | "notification"
  | "report";

export type AuditLog = {
  id: string;
  actorId: string;
  entityType: AdminEntityType;
  entityId: string;
  action: string;
  reason?: string;
  createdAt: string;
};

export type AdminModerationStatus = "open" | "reviewing" | "resolved" | "dismissed";
