import { Ticket, Plus, Search, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface VisitorManagementProps {
  visitors: any[];
}

export function VisitorManagement({ visitors: initialVisitors }: VisitorManagementProps) {
  const [visitors, setVisitors] = useState(initialVisitors);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPurpose, setFilterPurpose] = useState<string>('all');
  const [newTicket, setNewTicket] = useState({
    vehiclePlate: '',
    contactName: '',
    phone: '',
    purpose: 'Meeting',
    notes: '',
  });

  const filteredVisitors = visitors.filter(v => {
    const matchesSearch = v.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.contactName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesPurpose = filterPurpose === 'all' || v.purpose === filterPurpose;
    return matchesSearch && matchesStatus && matchesPurpose;
  });

  const activeTickets = visitors.filter(v => v.status === 'active').length;
  const completedToday = visitors.filter(v => v.status === 'completed').length;

  const handleGenerateTicket = () => {
    if (!newTicket.vehiclePlate) {
      toast.error('Vui lòng nhập biển số xe');
      return;
    }

    const ticket = {
      id: `VST-${String(1000 + visitors.length).padStart(6, '0')}`,
      ticketId: `TKT-${Date.now().toString().slice(-8)}-${visitors.length}`,
      vehiclePlate: newTicket.vehiclePlate,
      contactName: newTicket.contactName || null,
      phone: newTicket.phone || null,
      purpose: newTicket.purpose,
      entryTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      exitTime: null,
      duration: null,
      fee: null,
      status: 'active',
    };

    setVisitors([ticket, ...visitors]);
    setNewTicket({ vehiclePlate: '', contactName: '', phone: '', purpose: 'Meeting', notes: '' });
    setShowNewTicket(false);
    toast.success(`Đã phát hành vé ${ticket.ticketId}`);
  };

  const handleCompleteTicket = (visitorId: string) => {
    setVisitors(visitors.map(v => {
      if (v.id === visitorId) {
        const entryHour = parseInt(v.entryTime.split(':')[0]);
        const currentHour = new Date().getHours();
        const duration = Math.max(1, currentHour - entryHour);
        const fee = 10000 + (duration - 1) * 5000;

        return {
          ...v,
          exitTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          duration: `${duration}h 0m`,
          fee,
          status: 'completed',
        };
      }
      return v;
    }));
    toast.success('Đã hoàn tất vé khách');
  };

  const handleDeleteTicket = (visitorId: string) => {
    setVisitors(visitors.filter(v => v.id !== visitorId));
    toast.success('Đã xóa vé khách');
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1">Visitor Management</h1>
            <p className="text-muted-foreground">Temporary access tickets for visitors and exceptional cases</p>
          </div>
          <button
            onClick={() => setShowNewTicket(!showNewTicket)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="size-4" />
            Issue Ticket
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="size-5 text-chart-4" />
              <span className="text-[13px] text-muted-foreground">Active Tickets</span>
            </div>
            <div className="text-2xl font-medium">{activeTickets}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="size-5 text-chart-2" />
              <span className="text-[13px] text-muted-foreground">Completed Today</span>
            </div>
            <div className="text-2xl font-medium">{completedToday}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Ticket className="size-5 text-chart-1" />
              <span className="text-[13px] text-muted-foreground">Total Issued</span>
            </div>
            <div className="text-2xl font-medium">{visitors.length}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-muted rounded-full" />
              <span className="text-[13px] text-muted-foreground">Avg Duration</span>
            </div>
            <div className="text-2xl font-medium">2.4h</div>
          </div>
        </div>

        {/* New Ticket Form */}
        {showNewTicket && (
          <div className="bg-background border border-border rounded-lg p-6 mb-6">
            <h3 className="mb-4">Issue New Visitor Ticket</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Vehicle Plate Number</label>
                <input
                  type="text"
                  placeholder="e.g., 59A-12345"
                  value={newTicket.vehiclePlate}
                  onChange={(e) => setNewTicket({ ...newTicket, vehiclePlate: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Contact Name (Optional)</label>
                <input
                  type="text"
                  placeholder="Visitor name"
                  value={newTicket.contactName}
                  onChange={(e) => setNewTicket({ ...newTicket, contactName: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+84 xxx xxx xxx"
                  value={newTicket.phone}
                  onChange={(e) => setNewTicket({ ...newTicket, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Purpose of Visit</label>
                <select
                  value={newTicket.purpose}
                  onChange={(e) => setNewTicket({ ...newTicket, purpose: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Meeting</option>
                  <option>Event</option>
                  <option>Delivery</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[13px] mb-2 text-muted-foreground">Notes</label>
                <textarea
                  placeholder="Additional information..."
                  rows={2}
                  value={newTicket.notes}
                  onChange={(e) => setNewTicket({ ...newTicket, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleGenerateTicket}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Generate Ticket
              </button>
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-6 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-background border border-border rounded-lg mb-6">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ticket ID, vehicle plate, or contact name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Ticket ID</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Vehicle Plate</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Contact</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Entry Time</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Exit Time</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Duration</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Fee</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono">{visitor.ticketId}</td>
                    <td className="p-4 text-sm font-mono">{visitor.vehiclePlate}</td>
                    <td className="p-4 text-sm">
                      {visitor.contactName ? (
                        <div>
                          <div>{visitor.contactName}</div>
                          {visitor.phone && <div className="text-[11px] text-muted-foreground">{visitor.phone}</div>}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">{visitor.entryTime}</td>
                    <td className="p-4 text-sm">{visitor.exitTime || '—'}</td>
                    <td className="p-4 text-sm">{visitor.duration || '—'}</td>
                    <td className="p-4 text-sm">{visitor.fee ? `${visitor.fee.toLocaleString()} VND` : '—'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-medium ${
                          visitor.status === 'active'
                            ? 'bg-chart-4/10 text-chart-4'
                            : visitor.status === 'completed'
                            ? 'bg-chart-2/10 text-chart-2'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {visitor.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {visitor.status === 'active' && (
                          <button
                            onClick={() => handleCompleteTicket(visitor.id)}
                            className="text-sm text-chart-2 hover:underline"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTicket(visitor.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                          title="Delete ticket"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </button>
                      </div>
                    </td>
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