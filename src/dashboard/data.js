// Demonstration records from the original website; no backend persistence.
export function createDemoData() {
  return {
    inventory: [
      { id: 'excavator', status: 'available', available: 3, total: 5, code: 'EXC-1001', rate: 180, lastMaintenance: '2026-08-02' },
      { id: 'crane', status: 'rented', available: 0, total: 2, code: 'CRN-2010', rate: 420, lastMaintenance: '2026-07-20' },
      { id: 'compactor', status: 'maintenance', available: 1, total: 3, code: 'CMP-3005', rate: 90, lastMaintenance: '2026-09-01' },
      { id: 'generator', status: 'available', available: 4, total: 4, code: 'GEN-4002', rate: 60, lastMaintenance: '2026-06-15' },
      { id: 'loader', status: 'reserved', available: 0, total: 1, code: 'LDR-5001', rate: 150, lastMaintenance: '2026-05-30' },
      { id: 'mixer', status: 'available', available: 2, total: 2, code: 'MIX-6003', rate: 75, lastMaintenance: '2026-08-10' },
    ],
    requests: [
      { id: 'req-1', machineId: 'excavator', startDate: '2026-09-20', endDate: '2026-09-27', status: 'pending' },
      { id: 'req-2', machineId: 'compactor', startDate: '2026-09-18', endDate: '2026-09-22', status: 'approved' },
      { id: 'req-3', machineId: 'crane', startDate: '2026-09-25', endDate: '2026-10-05', status: 'pending' },
      { id: 'req-4', machineId: 'generator', startDate: '2026-09-15', endDate: '2026-09-19', status: 'rejected' },
      { id: 'req-5', machineId: 'loader', startDate: '2026-09-10', endDate: '2026-09-18', status: 'approved' },
    ],
    maintenance: [
      { id: 'maint-1', machineId: 'compactor', type: 'maintenance', description: 'Scheduled inspection and hydraulic fluid change.', date: '2026-09-01' },
      { id: 'maint-2', machineId: 'crane', type: 'incident', description: 'Reported abnormal noise in the lifting motor during operation.', date: '2026-09-05' },
    ],
  }
}
