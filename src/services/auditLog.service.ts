import { IAuditLogData } from '../interfaces/repositories/auditLog.repository.interface';
import { IAuditLogRepository } from '../interfaces/repositories/auditLog.repository.interface';

export class AuditLogService {
    constructor(private auditLogRepository: IAuditLogRepository) { }

    async log(data: IAuditLogData): Promise<void> {
        await this.auditLogRepository.create(data);
    }
}