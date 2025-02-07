"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queryKeys } from "@/lib/query/keys";

interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  metadata?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

async function fetchAuditLogs(): Promise<AuditLogEntry[]> {
  const response = await fetch("/api/admin/audit-logs");
  if (!response.ok) {
    throw new Error("Failed to fetch audit logs");
  }
  return response.json();
}

export function AuditLogViewer() {
  const { data: logs = [], isLoading } = useQuery({
    queryKey: queryKeys.audit.logs(),
    queryFn: fetchAuditLogs,
  });

  if (isLoading) {
    return <div>Loading audit logs...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Audit Logs</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{format(new Date(log.createdAt), "PPpp")}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  {log.entityType}: {log.entityId}
                </TableCell>
                <TableCell>{log.actorId}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>
                  {log.metadata ? (
                    <pre className="text-xs">
                      {JSON.stringify(JSON.parse(log.metadata), null, 2)}
                    </pre>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
