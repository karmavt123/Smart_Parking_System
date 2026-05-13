import { DollarSign, CreditCard, AlertCircle, CheckCircle, Clock, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

interface BillingPaymentsProps {
  billingData: any;
}

export function BillingPayments({ billingData }: BillingPaymentsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUserType, setFilterUserType] = useState<string>('all');

  const filteredTransactions = billingData.transactions.filter((t: any) => {
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesUserType = filterUserType === 'all' || t.userType === filterUserType;
    return matchesSearch && matchesStatus && matchesUserType;
  });

  const revenueData = [
    { month: 'Oct', amount: 45000000 },
    { month: 'Nov', amount: 52000000 },
    { month: 'Dec', amount: 48000000 },
    { month: 'Jan', amount: 58000000 },
    { month: 'Feb', amount: 62000000 },
    { month: 'Mar', amount: 71000000 },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-1">Billing & Payments</h1>
          <p className="text-muted-foreground">Fee management and payment tracking via BKPay</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="size-5 text-chart-2" />
              <span className="text-[13px] text-muted-foreground">Total Revenue (MTD)</span>
            </div>
            <div className="text-2xl font-medium mb-1">{billingData.monthlyRevenue.toLocaleString()} VND</div>
            <div className="text-[13px] text-chart-2">+12.5% vs last month</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="size-5 text-chart-2" />
              <span className="text-[13px] text-muted-foreground">Paid</span>
            </div>
            <div className="text-2xl font-medium mb-1">{billingData.paidCount}</div>
            <div className="text-[13px] text-muted-foreground">{billingData.paidAmount.toLocaleString()} VND</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="size-5 text-chart-4" />
              <span className="text-[13px] text-muted-foreground">Pending</span>
            </div>
            <div className="text-2xl font-medium mb-1">{billingData.pendingCount}</div>
            <div className="text-[13px] text-muted-foreground">{billingData.pendingAmount.toLocaleString()} VND</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="size-5 text-destructive" />
              <span className="text-[13px] text-muted-foreground">Overdue</span>
            </div>
            <div className="text-2xl font-medium mb-1">{billingData.overdueCount}</div>
            <div className="text-[13px] text-muted-foreground">{billingData.overdueAmount.toLocaleString()} VND</div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-background border border-border rounded-lg p-6 mb-8">
          <div className="mb-6">
            <h3 className="mb-1">Revenue Trend</h3>
            <p className="text-[13px] text-muted-foreground">Last 6 months</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                }}
                formatter={(value: any) => `${value.toLocaleString()} VND`}
              />
              <Bar dataKey="amount" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pricing Policy */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="mb-4">Learners</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Motorcycles</span>
                <span className="text-sm font-medium">3,000 VND/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Bicycles</span>
                <span className="text-sm font-medium">2,000 VND/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Billing Cycle</span>
                <span className="text-sm font-medium">Monthly</span>
              </div>
            </div>
          </div>
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="mb-4">Faculty & Staff</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cars</span>
                <span className="text-sm font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Motorcycles</span>
                <span className="text-sm font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reserved Slots</span>
                <span className="text-sm font-medium">Available</span>
              </div>
            </div>
          </div>
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="mb-4">Visitors</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">First Hour</span>
                <span className="text-sm font-medium">10,000 VND</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Additional Hours</span>
                <span className="text-sm font-medium">5,000 VND/hr</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Daily Max</span>
                <span className="text-sm font-medium">50,000 VND</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3>Recent Transactions</h3>
            <p className="text-[13px] text-muted-foreground">BKPay payment records</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Transaction ID</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User ID</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User Type</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Billing Period</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Payment Date</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Method</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn: any) => (
                  <tr key={txn.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono">{txn.id}</td>
                    <td className="p-4 text-sm font-mono">{txn.userId}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-medium ${
                          txn.userType === 'Learner'
                            ? 'bg-chart-1/10 text-chart-1'
                            : txn.userType === 'Visitor'
                            ? 'bg-chart-4/10 text-chart-4'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {txn.userType}
                      </span>
                    </td>
                    <td className="p-4 text-sm">{txn.billingPeriod}</td>
                    <td className="p-4 text-sm font-medium">{txn.amount.toLocaleString()} VND</td>
                    <td className="p-4 text-sm">{txn.paymentDate || '—'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-[11px] font-medium ${
                          txn.status === 'paid'
                            ? 'bg-chart-2/10 text-chart-2'
                            : txn.status === 'pending'
                            ? 'bg-chart-4/10 text-chart-4'
                            : 'bg-destructive/10 text-destructive'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{txn.method}</td>
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