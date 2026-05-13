import { Users, Search, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UserManagementProps {
  users: any[];
  onDeleteUser?: (userId: string) => void;
}

export function UserManagement({ users: initialUsers, onDeleteUser }: UserManagementProps) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.type === filterRole;
    return matchesSearch && matchesRole;
  });
////////////////////////////////////////
// THÊM MỚI: State cho Modal Thêm/Sửa
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    email: '',
    password: ''
  });

  // Hàm mở form thêm mới
  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', department: '', email: '', password: '' });
    setIsUserModalOpen(true);
  };

  // Hàm mở form chỉnh sửa
  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      department: user.department || '',
      email: user.email,
      password: '' // Bỏ trống mật khẩu cũ vì lý do bảo mật
    });
    setIsUserModalOpen(true);
  };
//////////////////////////////////////////
  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.userId !== userId));
    setDeleteConfirm(null);
    toast.success('Đã xóa tài khoản nhân viên');
    if (onDeleteUser) {
      onDeleteUser(userId);
    }
  };

  const getRoleBadge = (type: string) => {
    const colors: Record<string, string> = {
      'Learner': 'bg-chart-1/10 text-chart-1',
      'Faculty': 'bg-chart-2/10 text-chart-2',
      'Staff': 'bg-chart-3/10 text-chart-3',
      'Admin': 'bg-primary/10 text-primary',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-1">User Management</h1>
            <p className="text-muted-foreground">Manage user accounts and permissions synced from HCMUT_DATACORE</p>
          </div>
          <button onClick={handleOpenAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            Add User
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="size-5 text-foreground" />
              <span className="text-[13px] text-muted-foreground">Total Users</span>
            </div>
            <div className="text-2xl font-medium">{users.length}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-chart-1 rounded-full" />
              <span className="text-[13px] text-muted-foreground">Learners</span>
            </div>
            <div className="text-2xl font-medium">{users.filter(u => u.type === 'Learner').length}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-chart-2 rounded-full" />
              <span className="text-[13px] text-muted-foreground">Faculty</span>
            </div>
            <div className="text-2xl font-medium">{users.filter(u => u.type === 'Faculty').length}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-5 bg-chart-3 rounded-full" />
              <span className="text-[13px] text-muted-foreground">Staff</span>
            </div>
            <div className="text-2xl font-medium">{users.filter(u => u.type === 'Staff').length}</div>
          </div>
          <div className="p-5 bg-background border border-border rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="size-5 text-primary" />
              <span className="text-[13px] text-muted-foreground">Admins</span>
            </div>
            <div className="text-2xl font-medium">{users.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-background border border-border rounded-lg mb-6">
          <div className="p-4 flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by user ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterRole('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterRole === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterRole('Learner')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterRole === 'Learner'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Learners
              </button>
              <button
                onClick={() => setFilterRole('Faculty')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterRole === 'Faculty'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Faculty
              </button>
              <button
                onClick={() => setFilterRole('Staff')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterRole === 'Staff'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Staff
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-background border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User ID</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">User Type</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Department</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Active Sessions</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Last Access</th>
                  <th className="text-left p-4 text-[13px] font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="p-4 text-sm font-mono">{user.userId}</td>
                    <td className="p-4 text-sm font-medium">{user.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-medium ${getRoleBadge(user.type)}`}>
                        {user.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{user.email}</td>
                    <td className="p-4 text-sm">{user.department || '—'}</td>
                    <td className="p-4">
                      {user.role === 'admin' && (
                        <span className="px-2 py-1 rounded text-[11px] font-medium bg-primary/10 text-primary flex items-center gap-1 w-fit">
                          <Shield className="size-3" />
                          Admin
                        </span>
                      )}
                      {user.role === 'operator' && (
                        <span className="px-2 py-1 rounded text-[11px] font-medium bg-chart-3/10 text-chart-3 w-fit">
                          Operator
                        </span>
                      )}
                      {user.role === 'user' && (
                        <span className="text-[13px] text-muted-foreground">User</span>
                      )}
                    </td>
                    <td className="p-4 text-sm">{user.activeSessions}</td>
                    <td className="p-4 text-sm text-muted-foreground">{user.lastAccess}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-1.5 hover:bg-muted rounded transition-colors" title="Edit"
                        >
                          <Edit className="size-4 text-muted-foreground" />
                        </button>
                        <button
                          className="p-1.5 hover:bg-destructive/10 rounded transition-colors"
                          title="Delete"
                          onClick={() => setDeleteConfirm(user.userId)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-background border border-border rounded-2xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4">Xác nhận xóa tài khoản</h3>
            <p className="text-muted-foreground mb-6">
              Bạn có chắc chắn muốn xóa tài khoản nhân viên này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="flex-1 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Xóa tài khoản
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setIsUserModalOpen(false)}>
          <div className="bg-background border border-border rounded-2xl p-6 max-w-md w-full m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="mb-4 font-semibold text-lg">{editingUser ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium mb-1 text-muted-foreground">Tên nhân viên</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nhập tên nhân viên"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1 text-muted-foreground">Vị trí nhân viên</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Ví dụ: Staff, Operator..."
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1 text-muted-foreground">Email đăng nhập</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="email@hcmut.edu.vn"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium mb-1 text-muted-foreground">Mật khẩu</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={editingUser ? "Bỏ trống nếu không muốn đổi mật khẩu" : "Nhập mật khẩu cho nhân viên"}
                />
              </div>
              
              <div className="flex gap-3 mt-6 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    // Logic gửi API lưu data ở đây
                    setIsUserModalOpen(false);
                    toast.success(editingUser ? 'Cập nhật thành công!' : 'Thêm nhân viên thành công!');
                  }}
                  className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  {editingUser ? 'Lưu thay đổi' : 'Thêm nhân viên'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="flex-1 px-6 py-2 bg-muted text-foreground border border-border rounded-lg hover:bg-muted/80 transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}