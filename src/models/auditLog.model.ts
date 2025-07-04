import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    action: { type: String, required: true },
    method: { type: String, required: true },
    path: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);