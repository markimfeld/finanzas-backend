import { IAuditLogData, IAuditLogRepository } from '../../../interfaces/repositories/auditLog.repository.interface';
import { AuditLogModel } from '../../../models/auditLog.model';

export class AuditLogMongoRepository implements IAuditLogRepository {
    async create(log: IAuditLogData): Promise<void> {
        await AuditLogModel.create(log);
    }
}