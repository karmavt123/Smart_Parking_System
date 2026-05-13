import { Wifi, Database, CreditCard, Shield, Plus, Trash2, Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

// Mock device data
function generateDevices() {
  const deviceTypes = ['Parking Sensor', 'Camera', 'Access Gate', 'IoT Gateway'];
  const zones = ['Zone A', 'Zone B', 'Zone C', 'Zone D', 'Zone E'];
  const statuses = ['online', 'offline', 'maintenance'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `DEV-${String(1000 + i).padStart(6, '0')}`,
    name: `${deviceTypes[Math.floor(Math.random() * deviceTypes.length)]} ${i + 1}`,
    type: deviceTypes[Math.floor(Math.random() * deviceTypes.length)],
    zone: zones[Math.floor(Math.random() * zones.length)],
    status: i < 20 ? 'online' : statuses[Math.floor(Math.random() * statuses.length)],
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    lastUpdate: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    firmware: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
  }));
}

export function Settings() {
  const [devices, setDevices] = useState(generateDevices());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'Parking Sensor',
    zone: 'Zone A',
    ipAddress: '',
  });

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.ipAddress.includes(searchTerm);
    const matchesType = filterType === 'all' || device.type === filterType;
    const matchesStatus = filterStatus === 'all' || device.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.ipAddress) {
      toast.error('Vui lòng nhập đầy đủ thông tin thiết bị');
      return;
    }

    const device = {
      id: `DEV-${String(1000 + devices.length).padStart(6, '0')}`,
      name: newDevice.name,
      type: newDevice.type,
      zone: newDevice.zone,
      status: 'online' as const,
      ipAddress: newDevice.ipAddress,
      lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      firmware: 'v2.1.0',
    };

    setDevices([...devices, device]);
    setNewDevice({ name: '', type: 'Parking Sensor', zone: 'Zone A', ipAddress: '' });
    setShowAddDevice(false);
    toast.success('Đã thêm thiết bị mới thành công');
  };

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(devices.filter(d => d.id !== deviceId));
    toast.success('Đã xóa thiết bị');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-chart-2/10 text-chart-2';
      case 'offline': return 'bg-destructive/10 text-destructive';
      case 'maintenance': return 'bg-chart-4/10 text-chart-4';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online': return 'Hoạt động';
      case 'offline': return 'Ngoại tuyến';
      case 'maintenance': return 'Bảo trì';
      default: return status;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="mb-1">System Settings</h1>
          <p className="text-muted-foreground">Configure parking system parameters and integrations</p>
        </div>

        {/* Integration Status */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h3 className="mb-6">Integration Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Shield className="size-5 text-chart-2" />
                </div>
                <div>
                  <div className="font-medium">HCMUT_SSO</div>
                  <div className="text-[13px] text-muted-foreground">Authentication service</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-chart-2 rounded-full animate-pulse" />
                <span className="text-sm text-chart-2">Connected</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <Database className="size-5 text-chart-2" />
                </div>
                <div>
                  <div className="font-medium">HCMUT_DATACORE</div>
                  <div className="text-[13px] text-muted-foreground">User data synchronization</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-chart-2 rounded-full animate-pulse" />
                <span className="text-sm text-chart-2">Syncing</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-2/10 rounded-lg">
                  <CreditCard className="size-5 text-chart-2" />
                </div>
                <div>
                  <div className="font-medium">BKPay</div>
                  <div className="text-[13px] text-muted-foreground">Payment processing</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-chart-2 rounded-full animate-pulse" />
                <span className="text-sm text-chart-2">Active</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chart-4/10 rounded-lg">
                  <Wifi className="size-5 text-chart-4" />
                </div>
                <div>
                  <div className="font-medium">IoT Gateway Network</div>
                  <div className="text-[13px] text-muted-foreground">Sensor data collection</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 bg-chart-4 rounded-full animate-pulse" />
                <span className="text-sm text-chart-4">5 gateways online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Management */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3>IoT Device Management</h3>
            <button
              onClick={() => setShowAddDevice(true)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Plus className="size-4" />
              Add Device
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, name, or IP..."
                className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Types</option>
                <option value="Parking Sensor">Parking Sensor</option>
                <option value="Camera">Camera</option>
                <option value="Access Gate">Access Gate</option>
                <option value="IoT Gateway">IoT Gateway</option>
              </select>
            </div>
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Device Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="text-[13px] text-muted-foreground mb-1">Total Devices</div>
              <div className="text-2xl font-medium">{devices.length}</div>
            </div>
            <div className="p-4 bg-chart-2/10 rounded-lg">
              <div className="text-[13px] text-chart-2 mb-1">Online</div>
              <div className="text-2xl font-medium text-chart-2">{devices.filter(d => d.status === 'online').length}</div>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <div className="text-[13px] text-destructive mb-1">Offline</div>
              <div className="text-2xl font-medium text-destructive">{devices.filter(d => d.status === 'offline').length}</div>
            </div>
            <div className="p-4 bg-chart-4/10 rounded-lg">
              <div className="text-[13px] text-chart-4 mb-1">Maintenance</div>
              <div className="text-2xl font-medium text-chart-4">{devices.filter(d => d.status === 'maintenance').length}</div>
            </div>
          </div>

          {/* Devices Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Device ID</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Zone</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Last Update</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Firmware</th>
                  <th className="text-left p-3 text-[13px] font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map(device => (
                  <tr key={device.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-3 text-sm font-mono">{device.id}</td>
                    <td className="p-3 text-sm font-medium">{device.name}</td>
                    <td className="p-3 text-sm">{device.type}</td>
                    <td className="p-3 text-sm">{device.zone}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-[11px] font-medium ${getStatusColor(device.status)}`}>
                        {getStatusLabel(device.status)}
                      </span>
                    </td>
                    <td className="p-3 text-sm font-mono">{device.ipAddress}</td>
                    <td className="p-3 text-sm text-muted-foreground">{device.lastUpdate}</td>
                    <td className="p-3 text-sm font-mono">{device.firmware}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                        title="Delete device"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h3 className="mb-6">Pricing Configuration</h3>
          <div className="space-y-6">
            <div>
              <h4 className="mb-4 text-muted-foreground">Learners</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] mb-2 text-muted-foreground">Motorcycle (VND/day)</label>
                  <input
                    type="number"
                    defaultValue="3000"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[13px] mb-2 text-muted-foreground">Bicycle (VND/day)</label>
                  <input
                    type="number"
                    defaultValue="2000"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-4 text-muted-foreground">Visitors</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] mb-2 text-muted-foreground">First Hour (VND)</label>
                  <input
                    type="number"
                    defaultValue="10000"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[13px] mb-2 text-muted-foreground">Additional Hours (VND/hr)</label>
                  <input
                    type="number"
                    defaultValue="5000"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-[13px] mb-2 text-muted-foreground">Daily Maximum (VND)</label>
                  <input
                    type="number"
                    defaultValue="50000"
                    className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* IoT Sensor Configuration */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h3 className="mb-6">IoT Sensor Configuration</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[13px] mb-2 text-muted-foreground">Data Update Interval (seconds)</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-[13px] mb-2 text-muted-foreground">Sensor Timeout (seconds)</label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Enable automatic sensor malfunction alerts</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-sm">Fallback to manual verification when sensors are offline</span>
              </label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-background border border-border rounded-lg p-6 mb-6">
          <h3 className="mb-6">Notification Settings</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Occupancy Alerts</div>
                <div className="text-[13px] text-muted-foreground">Notify when zones reach capacity thresholds</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Payment Reminders</div>
                <div className="text-[13px] text-muted-foreground">Send billing reminders via BKPay</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">System Health Alerts</div>
                <div className="text-[13px] text-muted-foreground">Alert operators of sensor or gateway failures</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div>
                <div className="font-medium">Access Anomaly Detection</div>
                <div className="text-[13px] text-muted-foreground">Flag unusual entry/exit patterns</div>
              </div>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            Save Changes
          </button>
          <button className="px-6 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddDevice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddDevice(false)}>
          <div className="bg-background border border-border rounded-2xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-6">Add New Device</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Device Name</label>
                <input
                  type="text"
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="e.g., Parking Sensor 26"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Device Type</label>
                <select
                  value={newDevice.type}
                  onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Parking Sensor">Parking Sensor</option>
                  <option value="Camera">Camera</option>
                  <option value="Access Gate">Access Gate</option>
                  <option value="IoT Gateway">IoT Gateway</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">Zone</label>
                <select
                  value={newDevice.zone}
                  onChange={(e) => setNewDevice({ ...newDevice, zone: e.target.value })}
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="Zone A">Zone A</option>
                  <option value="Zone B">Zone B</option>
                  <option value="Zone C">Zone C</option>
                  <option value="Zone D">Zone D</option>
                  <option value="Zone E">Zone E</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] mb-2 text-muted-foreground">IP Address</label>
                <input
                  type="text"
                  value={newDevice.ipAddress}
                  onChange={(e) => setNewDevice({ ...newDevice, ipAddress: e.target.value })}
                  placeholder="192.168.1.100"
                  className="w-full px-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddDevice}
                className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Add Device
              </button>
              <button
                onClick={() => setShowAddDevice(false)}
                className="flex-1 px-6 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
