import { UserService } from './user.service';
import { UserRepositoryMongo } from '../repositories/implementations/mongodb/user.repository.mongo';
import { AuditLogMongoRepository } from '../repositories/implementations/mongodb/auditLog.repository';
import { AuditLogService } from './auditLog.service';

const userRepository = new UserRepositoryMongo();
export const userService = new UserService(userRepository);

const auditRepository = new AuditLogMongoRepository();
export const auditService = new AuditLogService(auditRepository);
