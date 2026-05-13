import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Key } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordProps {
  onBack: () => void;
  onResetPassword: (email: string, newPassword: string) => void;
}

export function ForgotPassword({ onBack, onResetPassword }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setIsLoading(true);
    
    // Simulate sending verification code
    setTimeout(() => {
      toast.success('Mã xác thực đã được gửi đến email của bạn');
      setStep('verify');
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      toast.error('Vui lòng nhập mã xác thực');
      return;
    }

    setIsLoading(true);
    
    // Simulate verification (in real app, this would verify with backend)
    setTimeout(() => {
      if (verificationCode === '123456') {
        toast.success('Mã xác thực hợp lệ');
        setStep('reset');
      } else {
        toast.error('Mã xác thực không đúng. Dùng mã: 123456');
      }
      setIsLoading(false);
    }, 800);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      onResetPassword(email, newPassword);
      toast.success('Đặt lại mật khẩu thành công!');
      setIsLoading(false);
      setTimeout(onBack, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-chart-2/5 p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Quay lại đăng nhập
        </button>

        <div className="bg-background border border-border rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center size-14 bg-primary/10 rounded-2xl mb-4">
              {step === 'email' && <Mail className="size-7 text-primary" />}
              {step === 'verify' && <CheckCircle2 className="size-7 text-primary" />}
              {step === 'reset' && <Key className="size-7 text-primary" />}
            </div>
            <h2 className="mb-2">
              {step === 'email' && 'Quên mật khẩu'}
              {step === 'verify' && 'Xác thực email'}
              {step === 'reset' && 'Tạo mật khẩu mới'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {step === 'email' && 'Nhập email của bạn để nhận mã xác thực'}
              {step === 'verify' && 'Nhập mã xác thực đã được gửi đến email'}
              {step === 'reset' && 'Nhập mật khẩu mới cho tài khoản của bạn'}
            </p>
          </div>

          {step === 'email' && (
            <form onSubmit={handleSendCode} className="space-y-6">
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi mã xác thực'
                )}
              </button>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium mb-2">
                  Mã xác thực
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all text-center text-2xl tracking-widest font-mono"
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-muted-foreground text-center">
                  Demo: Sử dụng mã <span className="font-mono font-medium text-foreground">123456</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    Đang xác thực...
                  </div>
                ) : (
                  'Xác thực'
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  toast.success('Mã xác thực mới đã được gửi');
                }}
                className="w-full text-sm text-primary hover:underline"
              >
                Gửi lại mã
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                  Mật khẩu mới
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ít nhất 8 ký tự"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                  Xác nhận mật khẩu
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-4 py-3 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-4 border-2 border-primary-foreground/20 border-t-primary-foreground rounded-full animate-spin" />
                    Đang đặt lại...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
