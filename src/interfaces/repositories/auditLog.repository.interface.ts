export interface IAuditLogData {
    userId?: string;
    action: string;
    method: string;
    path: string;
}

export interface IAuditLogRepository {
    create(log: IAuditLogData): Promise<void>;
}