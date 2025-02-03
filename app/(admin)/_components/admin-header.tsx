import { guardAdminRoute } from "@/lib/auth/admin-guard";

export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error?: ApiErrorResponse;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  metadata?: {
    hasMore: boolean;
    nextCursor?: string;
    total?: number;
  };
}

export async function AdminHeader() {
  const user = await guardAdminRoute();

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div>
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Logged in as {user.name}
        </p>
      </div>
    </div>
  );
}
