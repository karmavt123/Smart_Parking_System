import { Car, Users, DollarSign, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  parkingData: any;
  stats: any;
}

export function Dashboard({ parkingData, stats }: DashboardProps) {
  const occupancyTrend = [
    { time: '00:00', rate: 15 },
    { time: '04:00', rate: 8 },
    { time: '08:00', rate: 65 },
    { time: '12:00', rate: 88 },
    { time: '16:00', rate: 72 },
    { time: '20:00', rate: 35 },
  ];

  const zoneData = parkingData.zones.map((zone: any) => ({
    name: zone.name,
    occupied: zone.occupied,
    available: zone.total - zone.occupied,
    occupancyRate: (zone.occupied / zone.total) * 100,
  }));

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return '#d4183d';
    if (rate >= 70) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-1">Smart Parking Overview</h1>
          <p className="text-muted-foreground">Real-time monitoring across HCMUT campus parking facilities</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-muted rounded-md">
                <Car className="size-5 text-foreground" />
              </div>
              <span className="text-[13px] text-muted-foreground">Occupancy</span>
            </div>
            <div className="text-3xl font-medium mb-1">{stats.occupied}/{stats.total}</div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-muted-foreground">{stats.occupancyRate}% full</span>
              <span className={stats.trend > 0 ? 'text-chart-1' : 'text-chart-2'}>
                {stats.trend > 0 ? '+' : ''}{stats.trend}%
              </span>
            </div>
          </div>

          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-muted rounded-md">
                <Users className="size-5 text-foreground" />
              </div>
              <span className="text-[13px] text-muted-foreground">Active Sessions</span>
            </div>
            <div className="text-3xl font-medium mb-1">{stats.activeSessions}</div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-muted-foreground">Avg duration</span>
              <span className="text-foreground">{stats.avgDuration}h</span>
            </div>
          </div>

          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-muted rounded-md">
                <DollarSign className="size-5 text-foreground" />
              </div>
              <span className="text-[13px] text-muted-foreground">Today's Revenue</span>
            </div>
            <div className="text-3xl font-medium mb-1">{stats.revenue.toLocaleString()} VND</div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-muted-foreground">{stats.transactions} transactions</span>
            </div>
          </div>

          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-muted rounded-md">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <span className="text-[13px] text-muted-foreground">Alerts</span>
            </div>
            <div className="text-3xl font-medium mb-1">{stats.alerts}</div>
            <div className="flex items-center gap-1.5 text-[13px]">
              <span className="text-muted-foreground">{stats.sensorIssues} sensor issues</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <div className="mb-6">
              <h3 className="mb-1">Occupancy Trend</h3>
              <p className="text-[13px] text-muted-foreground">Last 24 hours</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={{ fill: 'var(--color-chart-1)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-background border border-border rounded-lg p-6">
            <div className="mb-6">
              <h3 className="mb-1">Zone Status</h3>
              <p className="text-[13px] text-muted-foreground">Current occupancy by zone</p>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={zoneData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="occupied" stackId="a" fill="var(--color-chart-1)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="available" stackId="a" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Zone Details */}
        <div className="bg-background border border-border rounded-lg">
          <div className="p-6 border-b border-border">
            <h3>Parking Zones</h3>
            <p className="text-[13px] text-muted-foreground">Real-time status and capacity</p>
          </div>
          <div className="divide-y divide-border">
            {parkingData.zones.map((zone: any) => {
              const occupancyRate = (zone.occupied / zone.total) * 100;
              const statusColor = getStatusColor(occupancyRate);

              return (
                <div key={zone.id} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="size-12 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-lg font-medium">{zone.name}</span>
                    </div>
                    <div>
                      <div className="font-medium mb-0.5">{zone.fullName}</div>
                      <div className="text-[13px] text-muted-foreground">{zone.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[13px] text-muted-foreground mb-0.5">Available</div>
                      <div className="text-lg font-medium">{zone.total - zone.occupied}/{zone.total}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] text-muted-foreground mb-0.5">Occupancy</div>
                      <div className="text-lg font-medium" style={{ color: statusColor }}>
                        {occupancyRate.toFixed(0)}%
                      </div>
                    </div>
                    <div className="w-32">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${occupancyRate}%`,
                            backgroundColor: statusColor,
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-[13px] text-muted-foreground min-w-24 text-right">
                      {zone.lastUpdate}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
