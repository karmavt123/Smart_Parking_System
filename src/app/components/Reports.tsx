import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Download, Calendar } from 'lucide-react';

export function Reports() {
  const usageByUserType = [
    { name: 'Learners', value: 68, count: 8456 },
    { name: 'Faculty', value: 18, count: 2234 },
    { name: 'Staff', value: 10, count: 1245 },
    { name: 'Visitors', value: 4, count: 498 },
  ];

  const peakHours = [
    { hour: '06:00', entries: 45 },
    { hour: '07:00', entries: 189 },
    { hour: '08:00', entries: 342 },
    { hour: '09:00', entries: 156 },
    { hour: '10:00', entries: 89 },
    { hour: '11:00', entries: 67 },
    { hour: '12:00', entries: 234 },
    { hour: '13:00', entries: 198 },
    { hour: '14:00', entries: 145 },
    { hour: '15:00', entries: 167 },
    { hour: '16:00', entries: 289 },
    { hour: '17:00', entries: 312 },
    { hour: '18:00', entries: 178 },
  ];

  const weeklyTrend = [
    { day: 'Mon', occupancy: 82, revenue: 4200000 },
    { day: 'Tue', occupancy: 85, revenue: 4500000 },
    { day: 'Wed', occupancy: 79, revenue: 4100000 },
    { day: 'Thu', occupancy: 88, revenue: 4800000 },
    { day: 'Fri', occupancy: 91, revenue: 5200000 },
    { day: 'Sat', occupancy: 45, revenue: 1800000 },
    { day: 'Sun', occupancy: 38, revenue: 1500000 },
  ];

  const COLORS = ['var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)', 'var(--color-chart-4)'];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1">Reports & Analytics</h1>
            <p className="text-muted-foreground">Usage statistics and performance metrics</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors flex items-center gap-2">
              <Calendar className="size-4" />
              Last 30 Days
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Download className="size-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="text-[13px] text-muted-foreground mb-1">Total Parking Sessions</div>
            <div className="text-3xl font-medium mb-2">12,433</div>
            <div className="text-[13px] text-chart-2">+8.2% vs last month</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="text-[13px] text-muted-foreground mb-1">Average Occupancy</div>
            <div className="text-3xl font-medium mb-2">78.5%</div>
            <div className="text-[13px] text-chart-2">+2.1% vs last month</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="text-[13px] text-muted-foreground mb-1">Total Revenue</div>
            <div className="text-3xl font-medium mb-2">26.1M VND</div>
            <div className="text-[13px] text-chart-2">+12.5% vs last month</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="text-[13px] text-muted-foreground mb-1">Avg Session Duration</div>
            <div className="text-3xl font-medium mb-2">4.2h</div>
            <div className="text-[13px] text-muted-foreground">-0.3h vs last month</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Usage by User Type */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="mb-6">
              <h3 className="mb-1">Usage by User Type</h3>
              <p className="text-[13px] text-muted-foreground">Distribution of parking sessions</p>
            </div>
            <div className="flex items-center">
              <ResponsiveContainer width="50%" height={240}>
                <PieChart>
                  <Pie
                    data={usageByUserType}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {usageByUserType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-popover)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '6px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-3">
                {usageByUserType.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.value}%</div>
                      <div className="text-[11px] text-muted-foreground">{item.count.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Peak Hours */}
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="mb-6">
              <h3 className="mb-1">Peak Entry Hours</h3>
              <p className="text-[13px] text-muted-foreground">Entry frequency throughout the day</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={peakHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="entries" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <div className="mb-6">
            <h3 className="mb-1">Weekly Performance</h3>
            <p className="text-[13px] text-muted-foreground">Occupancy rate and revenue by day</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis
                yAxisId="left"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                label={{ value: 'Occupancy %', angle: -90, position: 'insideLeft' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                label={{ value: 'Revenue (VND)', angle: 90, position: 'insideRight' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="occupancy"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-chart-1)', r: 4 }}
                name="Occupancy %"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: 'var(--color-chart-2)', r: 4 }}
                name="Revenue (VND)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Performance */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3>Zone Performance Summary</h3>
            <p className="text-[13px] text-muted-foreground">Utilization and revenue by parking zone</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Zone</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Capacity</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Avg Occupancy</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Peak Occupancy</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Total Sessions</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { zone: 'Zone A - Main Campus', capacity: 150, avgOcc: 82, peakOcc: 96, sessions: 3245, revenue: 8450000, util: 85 },
                  { zone: 'Zone B - Faculty Building', capacity: 80, avgOcc: 75, peakOcc: 89, sessions: 1823, revenue: 4230000, util: 78 },
                  { zone: 'Zone C - Student Center', capacity: 200, avgOcc: 88, peakOcc: 98, sessions: 4567, revenue: 9870000, util: 92 },
                  { zone: 'Zone D - Library', capacity: 120, avgOcc: 71, peakOcc: 85, sessions: 2198, revenue: 5120000, util: 74 },
                  { zone: 'Zone E - Sports Complex', capacity: 100, avgOcc: 45, peakOcc: 78, sessions: 1600, revenue: 2430000, util: 53 },
                ].map((zone) => (
                  <tr key={zone.zone} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-medium">{zone.zone}</td>
                    <td className="p-4 text-sm">{zone.capacity}</td>
                    <td className="p-4 text-sm">{zone.avgOcc}%</td>
                    <td className="p-4 text-sm">{zone.peakOcc}%</td>
                    <td className="p-4 text-sm">{zone.sessions.toLocaleString()}</td>
                    <td className="p-4 text-sm font-medium">{zone.revenue.toLocaleString()} VND</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-chart-1 transition-all"
                            style={{ width: `${zone.util}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12">{zone.util}%</span>
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
