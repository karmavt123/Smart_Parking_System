import { useState } from 'react';
import { LogIn, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

interface LoginProps {
  onLogin: (email: string, password: string) => boolean;
  onForgotPassword: () => void;
}

export function Login({ onLogin, onForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginRole, setLoginRole] = useState<'admin' | 'staff'>('admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const success = onLogin(email, password);
      
      if (success) {
        toast.success('Đăng nhập thành công!');
      } else {
        toast.error('Email hoặc mật khẩu không đúng');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 bg-primary rounded-2xl mb-4">
            <LayoutDashboard className="size-8 text-primary-foreground" />
          </div>
          {/* THAY ĐỔI: Tiêu đề thay đổi theo role */}
          <h1 className="mb-2">{loginRole === 'admin' ? 'IoT-SPMS Admin' : 'IoT-SPMS Staff'}</h1>          
          <p className="text-muted-foreground">Hệ thống Quản lý Bãi đỗ xe Thông minh HCMUT</p>
        </div>

        {/* Login Form */}
        <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
          {/* THÊM MỚI: Thanh chuyển đổi (Tab) Admin / Nhân viên */}
          <div className="flex bg-muted p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => {
                setLoginRole('admin');
                setEmail('admin@gmail.com'); // Tự động điền email demo
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginRole === 'admin' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Quản trị viên
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginRole('staff');
                setEmail('staff@hcmut.edu.vn'); // Tự động điền email demo nhân viên
              }}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                loginRole === 'staff' 
                  ? 'bg-background shadow-sm text-foreground' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Nhân viên
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted rounded transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Ghi nhớ đăng nhập</span>
              </label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="size-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  <LogIn className="size-4" />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Dùng tài khoản demo: <span className="font-mono text-foreground">{loginRole === 'admin' ? 'admin@gmail.com' : 'staff@hcmut.edu.vn'}</span> / <span className="font-mono text-foreground">12345678</span>            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© 2026 HCMUT. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
