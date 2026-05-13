import { useState, useEffect } from 'react';
import { LayoutDashboard, Map, LogIn, Ticket, DollarSign, Users, BarChart3, Settings as SettingsIcon, Menu, X, Layers, LogOut } from 'lucide-react';
import { Login } from './components/Login';
import { ForgotPassword } from './components/ForgotPassword';
import { Dashboard } from './components/Dashboard';
import { ParkingMap } from './components/ParkingMap';
import { AccessControl } from './components/AccessControl';
import { VisitorManagement } from './components/VisitorManagement';
import { BillingPayments } from './components/BillingPayments';
import { UserManagement } from './components/UserManagement';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { SpaceControl } from './components/SpaceControl';
import { Toaster } from './components/ui/sonner';

// Generate mock parking data
function generateParkingData() {
  const zones = [
    { id: 'A', name: 'A', fullName: 'Zone A - Main Campus', type: 'General Parking', total: 150 },
    { id: 'B', name: 'B', fullName: 'Zone B - Faculty Building', type: 'Faculty Reserved', total: 80 },
    { id: 'C', name: 'C', fullName: 'Zone C - Student Center', type: 'General Parking', total: 200 },
    { id: 'D', name: 'D', fullName: 'Zone D - Library', type: 'General Parking', total: 120 },
    { id: 'E', name: 'E', fullName: 'Zone E - Sports Complex', type: 'General Parking', total: 100 },
  ];

  return {
    zones: zones.map(zone => {
      const occupied = Math.floor(Math.random() * zone.total * 0.5) + Math.floor(zone.total * 0.3);
      const slots = Array.from({ length: zone.total }, (_, i) => ({
        id: `${zone.id}-${i + 1}`,
        number: `${zone.id}${(i + 1).toString().padStart(3, '0')}`,
        occupied: i < occupied,
        reserved: zone.type === 'Faculty Reserved' && i < 10,
        sensorActive: Math.random() > 0.05,
        vehicleType: i < occupied ? (Math.random() > 0.3 ? 'Motorcycle' : 'Car') : null,
      }));

      return {
        ...zone,
        occupied,
        slots,
        lastUpdate: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    }),
  };
}

// Generate mock access logs
function generateAccessLogs() {
  const userTypes = ['Learner', 'Faculty', 'Staff', 'Visitor'];
  const types = ['entry', 'exit'];
  const gates = ['Gate 1 - Main', 'Gate 2 - North', 'Gate 3 - South'];
  const methods = ['HCMUT ID Card', 'Visitor Ticket', 'Manual Entry'];

  return Array.from({ length: 50 }, (_, i) => {
    const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
    const isVisitor = userType === 'Visitor';
    const timestamp = new Date(Date.now() - i * 120000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    return {
      id: `LOG-${String(1000 + i).padStart(6, '0')}`,
      timestamp,
      type: types[Math.floor(Math.random() * types.length)],
      userId: isVisitor ? `VST-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}` : `${Math.floor(Math.random() * 9000000) + 1000000}`,
      userName: isVisitor ? 'Visitor' : `${['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang'][Math.floor(Math.random() * 5)]} Van ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      userType,
      vehiclePlate: Math.random() > 0.3 ? `59${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}` : null,
      gate: gates[Math.floor(Math.random() * gates.length)],
      zone: Math.random() > 0.5 ? `Zone ${['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)]}` : null,
      method: isVisitor ? 'Visitor Ticket' : 'HCMUT ID Card',
    };
  });
}

// Generate mock visitors
function generateVisitors() {
  const statuses = ['active', 'completed'];
  const purposes = ['Meeting', 'Event', 'Delivery', 'Other'];

  return Array.from({ length: 30 }, (_, i) => {
    const status = i < 8 ? 'active' : 'completed';
    const entryHour = Math.floor(Math.random() * 8) + 7;
    const duration = status === 'completed' ? Math.floor(Math.random() * 4) + 1 : null;

    return {
      id: `VST-${String(1000 + i).padStart(6, '0')}`,
      ticketId: `TKT-${Date.now().toString().slice(-8)}-${i}`,
      vehiclePlate: `59${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]}-${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`,
      contactName: Math.random() > 0.5 ? `${['Nguyen', 'Tran', 'Le'][Math.floor(Math.random() * 3)]} Van ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}` : null,
      phone: Math.random() > 0.5 ? `+84 ${Math.floor(Math.random() * 900000000) + 100000000}` : null,
      purpose: purposes[Math.floor(Math.random() * purposes.length)],
      entryTime: `${entryHour}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      exitTime: status === 'completed' ? `${entryHour + duration}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : null,
      duration: status === 'completed' ? `${duration}h ${Math.floor(Math.random() * 60)}m` : null,
      fee: status === 'completed' ? 10000 + (duration - 1) * 5000 : null,
      status,
    };
  });
}

// Generate mock billing data
function generateBillingData() {
  const statuses = ['paid', 'pending', 'overdue'];
  const userTypes = ['Learner', 'Visitor'];

  const transactions = Array.from({ length: 25 }, (_, i) => {
    const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amount = userType === 'Learner' ? Math.floor(Math.random() * 50000) + 60000 : Math.floor(Math.random() * 30000) + 10000;

    return {
      id: `TXN-${String(10000 + i).padStart(8, '0')}`,
      userId: `${Math.floor(Math.random() * 9000000) + 1000000}`,
      userType,
      billingPeriod: userType === 'Learner' ? 'March 2026' : `${['Mar 01', 'Mar 05', 'Mar 10'][Math.floor(Math.random() * 3)]}, 2026`,
      amount,
      paymentDate: status === 'paid' ? `2026-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` : null,
      status,
      method: 'BKPay',
    };
  });

  const paidTransactions = transactions.filter(t => t.status === 'paid');
  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const overdueTransactions = transactions.filter(t => t.status === 'overdue');

  return {
    monthlyRevenue: 71000000,
    paidCount: paidTransactions.length,
    paidAmount: paidTransactions.reduce((sum, t) => sum + t.amount, 0),
    pendingCount: pendingTransactions.length,
    pendingAmount: pendingTransactions.reduce((sum, t) => sum + t.amount, 0),
    overdueCount: overdueTransactions.length,
    overdueAmount: overdueTransactions.reduce((sum, t) => sum + t.amount, 0),
    transactions,
  };
}

// Generate mock users
function generateUsers() {
  const userTypes = ['Learner', 'Faculty', 'Staff'];
  const roles = ['user', 'operator', 'admin'];
  const departments = ['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Administration'];

  return Array.from({ length: 40 }, (_, i) => {
    const userType = userTypes[Math.floor(Math.random() * userTypes.length)];
    const role = i < 3 ? 'admin' : i < 8 ? 'operator' : 'user';

    return {
      userId: `${Math.floor(Math.random() * 9000000) + 1000000}`,
      name: `${['Nguyen', 'Tran', 'Le', 'Pham', 'Hoang', 'Vo', 'Dang'][Math.floor(Math.random() * 7)]} ${['Van', 'Thi', 'Thanh', 'Minh'][Math.floor(Math.random() * 4)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      type: userType,
      email: `user${i}@hcmut.edu.vn`,
      department: userType !== 'Learner' ? departments[Math.floor(Math.random() * departments.length)] : null,
      role,
      activeSessions: Math.floor(Math.random() * 3),
      lastAccess: `2026-04-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
    };
  });
}

type NavItem = 'dashboard' | 'map' | 'spacecontrol' | 'access' | 'visitors' | 'billing' | 'users' | 'reports' | 'settings';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [adminPassword, setAdminPassword] = useState('12345678'); // Default password
  const [currentView, setCurrentView] = useState<NavItem>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [parkingData, setParkingData] = useState(generateParkingData());
  const [accessLogs] = useState(generateAccessLogs());
  const [visitors] = useState(generateVisitors());
  const [billingData] = useState(generateBillingData());
  const [users] = useState(generateUsers());

  // Check for saved session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('iot-spms-session');
    if (savedSession) {
      setIsAuthenticated(true);
    }
  }, []);

  // Simulate real-time updates every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setParkingData(prev => ({
        zones: prev.zones.map(zone => {
          // Generate random status distribution for each slot
          let occupied = 0;
          let offline = 0;
          
          const slots = zone.slots.map((slot) => {
            const rand = Math.random();
            let newOccupied = false;
            let newReserved = false;
            let newSensorActive = true;

            // 5% chance offline
            if (rand < 0.05) {
              newSensorActive = false;
              offline++;
            }
            // 40-50% chance occupied
            else if (rand < 0.4 + Math.random() * 0.1) {
              newOccupied = true;
              occupied++;
            }
            // Faculty reserved zones have more reserved slots
            else if (zone.type === 'Faculty Reserved' && rand < 0.2) {
              newReserved = true;
            }

            return {
              ...slot,
              occupied: newOccupied,
              reserved: newReserved,
              sensorActive: newSensorActive,
              vehicleType: newOccupied ? (Math.random() > 0.3 ? 'Motorcycle' : 'Car') : null,
            };
          });

          return {
            ...zone,
            occupied,
            slots,
            lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          };
        }),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (email: string, password: string): boolean => {
    // Validate credentials
    if (email === 'admin@gmail.com' && password === adminPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('iot-spms-session', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('iot-spms-session');
  };

  const handleResetPassword = (email: string, newPassword: string) => {
    if (email === 'admin@gmail.com') {
      setAdminPassword(newPassword);
    }
  };

  const handleAddZone = (zoneInfo: { id: string; name: string; fullName: string; type: string; total: number; areaCapacities: number[] }) => {
    setParkingData(prev => {
      const occupied = Math.floor(zoneInfo.total * 0.35);
      const slots = Array.from({ length: zoneInfo.total }, (_, i) => ({
        id: `${zoneInfo.id}-${i + 1}`,
        number: `${zoneInfo.id}${(i + 1).toString().padStart(3, '0')}`,
        occupied: i < occupied,
        reserved: false,
        sensorActive: Math.random() > 0.05,
        vehicleType: i < occupied ? (Math.random() > 0.3 ? 'Motorcycle' : 'Car') : null,
      }));
      return {
        zones: [...prev.zones, {
          ...zoneInfo,
          occupied,
          slots,
          areaCapacities: zoneInfo.areaCapacities,
          lastUpdate: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }],
      };
    });
  };

  const handleUpdateZone = (zoneId: string, updates: { fullName: string; type: string }) => {
    setParkingData(prev => ({
      zones: prev.zones.map(z => z.id === zoneId ? { ...z, ...updates } : z),
    }));
  };

  const handleDeleteZone = (zoneId: string) => {
    setParkingData(prev => ({ zones: prev.zones.filter(z => z.id !== zoneId) }));
  };

  // Show login/forgot password screens if not authenticated
  if (!isAuthenticated) {
    if (showForgotPassword) {
      return (
        <>
          <ForgotPassword
            onBack={() => setShowForgotPassword(false)}
            onResetPassword={handleResetPassword}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <Login
          onLogin={handleLogin}
          onForgotPassword={() => setShowForgotPassword(true)}
        />
        <Toaster />
      </>
    );
  }

  // Calculate stats
  const stats = {
    total: parkingData.zones.reduce((sum, z) => sum + z.total, 0),
    occupied: parkingData.zones.reduce((sum, z) => sum + z.occupied, 0),
    occupancyRate: Math.round((parkingData.zones.reduce((sum, z) => sum + z.occupied, 0) / parkingData.zones.reduce((sum, z) => sum + z.total, 0)) * 100),
    trend: 2.3,
    activeSessions: 758,
    avgDuration: 4.2,
    revenue: 2340000,
    transactions: 1247,
    alerts: 3,
    sensorIssues: 2,
  };

  const navItems = [
    { id: 'dashboard' as NavItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map' as NavItem, label: 'Parking Map', icon: Map },
    { id: 'spacecontrol' as NavItem, label: 'Space Control', icon: Layers },
    { id: 'access' as NavItem, label: 'Access Control', icon: LogIn },
    { id: 'visitors' as NavItem, label: 'Visitor Management', icon: Ticket },
    { id: 'billing' as NavItem, label: 'Billing & Payments', icon: DollarSign },
    { id: 'users' as NavItem, label: 'User Management', icon: Users },
    { id: 'reports' as NavItem, label: 'Reports', icon: BarChart3 },
    { id: 'settings' as NavItem, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="size-full flex bg-muted/20">
      <Toaster />
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-sidebar border-r border-sidebar-border flex flex-col overflow-hidden shrink-0`}>
        <div className={`border-b border-sidebar-border ${sidebarOpen ? 'p-6' : 'p-3 flex justify-center'}`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <LayoutDashboard className="size-6 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <div className="font-medium text-sidebar-foreground whitespace-nowrap">IoT-SPMS</div>
                <div className="text-[11px] text-sidebar-foreground/60 whitespace-nowrap">HCMUT Smart Parking</div>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (sidebarOpen) setSidebarOpen(false);
                  }}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg transition-colors ${
                    sidebarOpen ? 'gap-3 px-3 py-2.5' : 'justify-center px-2 py-2.5'
                  } ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  }`}
                >
                  <Icon className="size-5 shrink-0" />
                  {sidebarOpen && <span className="text-sm whitespace-nowrap">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </nav>

        <div className={`border-t border-sidebar-border space-y-2 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
          {sidebarOpen ? (
            <div className="flex items-center gap-3 p-3 bg-sidebar-accent rounded-lg">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium shrink-0">
                A
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-sidebar-foreground truncate">Admin User</div>
                <div className="text-[11px] text-sidebar-foreground/60">admin@gmail.com</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center p-1">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium" title="Admin User">
                A
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={!sidebarOpen ? 'Đăng xuất' : undefined}
            className={`w-full flex items-center rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors ${
              sidebarOpen ? 'gap-3 px-3 py-2' : 'justify-center px-2 py-2'
            }`}
          >
            <LogOut className="size-4 shrink-0" />
            {sidebarOpen && <span className="text-sm">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="h-16 bg-background border-b border-border flex items-center px-6 justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="size-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <div className="size-2 bg-chart-2 rounded-full animate-pulse" />
              <span className="text-sm">System Online</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* View Content */}
        {currentView === 'dashboard' && <Dashboard parkingData={parkingData} stats={stats} />}
        {currentView === 'map' && <ParkingMap parkingData={parkingData} />}
        {currentView === 'spacecontrol' && <SpaceControl parkingData={parkingData} onAddZone={handleAddZone} onUpdateZone={handleUpdateZone} onDeleteZone={handleDeleteZone} />}
        {currentView === 'access' && <AccessControl accessLogs={accessLogs} />}
        {currentView === 'visitors' && <VisitorManagement visitors={visitors} />}
        {currentView === 'billing' && <BillingPayments billingData={billingData} />}
        {currentView === 'users' && <UserManagement users={users} />}
        {currentView === 'reports' && <Reports />}
        {currentView === 'settings' && <Settings />}
      </div>
    </div>
  );
}