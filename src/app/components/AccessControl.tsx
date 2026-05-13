import { ArrowDownCircle, ArrowUpCircle, Search, Filter, Download } from 'lucide-react';
import { useState } from 'react';

interface AccessControlProps {
  accessLogs: any[];
}

export function AccessControl({ accessLogs }: AccessControlProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'entry' | 'exit'>('all');
  const [filterUserType, setFilterUserType] = useState<string>('all');
  const [filterGate, setFilterGate] = useState<string>('all');

  const filteredLogs = accessLogs.filter(log => {
    const matchesSearch = log.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.vehiclePlate?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesUserType = filterUserType === 'all' || log.userType === filterUserType;
    const matchesGate = filterGate === 'all' || log.gate === filterGate;
    return matchesSearch && matchesType && matchesUserType && matchesGate;
  });

  const getUserTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Learner': 'bg-chart-1/10 text-chart-1',
      'Faculty': 'bg-chart-2/10 text-chart-2',
      'Staff': 'bg-chart-3/10 text-chart-3',
      'Visitor': 'bg-chart-4/10 text-chart-4',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-1">Access Control</h1>
          <p className="text-muted-foreground">Entry and exit activity logs</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ArrowDownCircle className="size-5 text-chart-2" />
              <span className="text-[13px] text-muted-foreground">Entries Today</span>
            </div>
            <div className="text-2xl font-medium">1,247</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <ArrowUpCircle className="size-5 text-chart-1" />
              <span className="text-[13px] text-muted-foreground">Exits Today</span>
            </div>
            <div className="text-2xl font-medium">1,189</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-chart-4 rounded-full" />
              <span className="text-[13px] text-muted-foreground">Currently Inside</span>
            </div>
            <div className="text-2xl font-medium">758</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-muted rounded-full" />
              <span className="text-[13px] text-muted-foreground">Failed Scans</span>
            </div>
            <div className="text-2xl font-medium">12</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background border border-border rounded-lg mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by user ID, name, or vehicle plate..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('entry')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'entry'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Entries
              </button>
              <button
                onClick={() => setFilterType('exit')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === 'exit'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Exits
              </button>
            </div>
            <button className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Download className="size-4" />
              Export
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Time</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User ID</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User Type</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Vehicle Plate</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Gate</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Zone</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm">{log.timestamp}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {log.type === 'entry' ? (
                          <ArrowDownCircle className="size-4 text-chart-2" />
                        ) : (
                          <ArrowUpCircle className="size-4 text-chart-1" />
                        )}
                        <span className="text-sm capitalize">{log.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono">{log.userId}</td>
                    <td className="p-4 text-sm">{log.userName}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-medium ${getUserTypeBadge(log.userType)}`}>
                        {log.userType}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-mono">{log.vehiclePlate || '—'}</td>
                    <td className="p-4 text-sm">{log.gate}</td>
                    <td className="p-4 text-sm">{log.zone || '—'}</td>
                    <td className="p-4 text-sm text-muted-foreground">{log.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}