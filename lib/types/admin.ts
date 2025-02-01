export interface AdminStats {
  totalUsers: number;
  totalOrganizations: number;
  activeSessions: number;
}

export interface AdminStatsResponse {
  data: AdminStats | null;
  error: { message: string } | null;
}
