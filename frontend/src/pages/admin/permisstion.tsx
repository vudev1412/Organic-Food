import React, { useState, useEffect } from "react";
import {
  Shield,
  Users,
  Lock,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  Search,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

import {
  createRoleAPI,
  deleteRoleAPI,
  getAllPermissionsAPI,
  getAllRolesAPI,
  updatePermissionsForRoleAPI,
} from "../../service/api";

export default function RolePermissionManager() {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await getAllRolesAPI();
      setRoles(res.data.data ?? []);
    } catch {
      toast.error("Không tải được danh sách role");
      setRoles([]);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await getAllPermissionsAPI();
      setPermissions(res.data.data ?? []);
    } catch {
      toast.error("Không tải được danh sách quyền");
    }
  };

  const permissionsByCategory = permissions.reduce((acc, perm) => {
    const category = perm.category || "Khác";
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {} as Record<string, IPermission[]>);

  const handleTogglePermission = (perm: IPermission) => {
    if (!editingRole) return;
    const exists = editingRole.permissions.some((p) => p.id === perm.id);
    const newPermissions = exists
      ? editingRole.permissions.filter((p) => p.id !== perm.id)
      : [...editingRole.permissions, perm];

    setEditingRole({ ...editingRole, permissions: newPermissions });
  };

  const handleSaveRole = async () => {
    if (!editingRole) return;

    const permNames = editingRole.permissions.map((p) => p.name);

    try {
      await updatePermissionsForRoleAPI(editingRole.name, permNames);

      const updatedRole = { ...editingRole };

      setRoles((prev) =>
        prev.map((r) => (r.name === editingRole.name ? updatedRole : r))
      );
      setSelectedRole(updatedRole);
      setEditingRole(null);

      toast.success(`Đã cập nhật role "${editingRole.name}"`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleAddRole = async () => {
    if (!newRoleName.trim()) {
      toast.error("Vui lòng nhập tên role");
      return;
    }

    const roleName = newRoleName.trim().toUpperCase();

    if (roles.some((r) => r.name === roleName)) {
      toast.error("Role đã tồn tại!");
      return;
    }

    try {
      const res = await createRoleAPI(roleName);

      const newRole: IRole = {
        id: res.data.id || Date.now(),
        name: roleName,
        permissions: [],
        userCount: 0,
      };

      setRoles((prev) => [newRole, ...prev]);
      setSelectedRole(newRole);
      setEditingRole(newRole);
      setNewRoleName("");
      setShowAddRole(false);

      toast.success("Tạo role thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không tạo được role");
    }
  };

  const handleDeleteRole = async (roleName: string) => {
    if (!confirm(`Xóa role "${roleName}"?`)) return;

    try {
      await deleteRoleAPI(roleName);
      setRoles((prev) => prev.filter((r) => r.name !== roleName));
      setSelectedRole(null);
      setEditingRole(null);
      toast.success("Đã xóa role");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Xóa thất bại!");
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentRole = editingRole || selectedRole;

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="bg-white shadow rounded-xl p-6 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 flex items-center justify-center rounded-xl">
                <Shield className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quản lý phân quyền</h1>
                <p className="text-gray-500 text-sm">Role – Permission – Access Control</p>
              </div>
            </div>

            <button
              onClick={() => setShowAddRole(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Tạo role
            </button>
          </div>

          <div className="grid grid-cols-12 gap-6">

            {/* SIDEBAR */}
            <div className="col-span-4">
              <div className="bg-white shadow rounded-xl overflow-hidden">

                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Tìm role..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="max-h-[650px] overflow-y-auto divide-y">
                  {filteredRoles.map((role) => (
                    <div
                      key={role.id}
                      onClick={() => {
                        setSelectedRole(role);
                        setEditingRole(null);
                      }}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedRole?.name === role.name
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Shield className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold">{role.name}</div>
                            <div className="text-xs text-gray-500 flex gap-1 items-center">
                              <Users className="w-3 h-3" />
                              {role.userCount} users
                            </div>
                          </div>
                        </div>

                        {role.name !== "ADMIN" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.name);
                            }}
                            className="p-2 hover:bg-red-100 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MAIN */}
            <div className="col-span-8">
              {currentRole ? (
                <div className="bg-white shadow rounded-xl">

                  {/* ROLE HEADER */}
                  <div className="p-6 border-b flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold">{currentRole.name}</h2>
                      <p className="text-gray-500 text-sm">
                        {currentRole.permissions.length} quyền được gán
                      </p>
                    </div>

                    {editingRole ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingRole(null)}
                          className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        >
                          <X className="w-4 h-4" /> Hủy
                        </button>
                        <button
                          onClick={handleSaveRole}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingRole(currentRole)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" /> Chỉnh sửa
                      </button>
                    )}
                  </div>

                  {/* PERMISSIONS */}
                  <div className="p-6 max-h-[650px] overflow-y-auto">
                    {Object.entries(permissionsByCategory).map(
                      ([category, perms]) => (
                        <div key={category} className="mb-6">
                          <h3 className="text-sm font-semibold mb-3 text-gray-600">
                            {category}
                          </h3>

                          <div className="grid grid-cols-2 gap-3">
                            {perms.map((perm) => {
                              const isChecked = currentRole.permissions.some(
                                (p) => p.id === perm.id
                              );
                              const isDisabled = !editingRole;

                              return (
                                <div
                                  key={perm.id}
                                  onClick={() =>
                                    !isDisabled && handleTogglePermission(perm)
                                  }
                                  className={`p-3 rounded-lg border cursor-pointer transition ${
                                    isChecked
                                      ? "bg-blue-50 border-blue-500"
                                      : "bg-gray-50 border-gray-200"
                                  } ${isDisabled ? "opacity-70" : "hover:shadow"}`}
                                >
                                  <div className="flex gap-3 items-center">
                                    <div
                                      className={`w-5 h-5 border rounded flex items-center justify-center ${
                                        isChecked
                                          ? "bg-blue-600 border-blue-600"
                                          : "border-gray-400"
                                      }`}
                                    >
                                      {isChecked && (
                                        <Check className="text-white w-3 h-3" />
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm ${
                                        isChecked
                                          ? "text-blue-900 font-medium"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      {perm.name}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-xl p-12 text-center">
                  <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold">Chọn role để xem chi tiết</h3>
                  <p className="text-gray-500">Hãy chọn từ danh sách bên trái</p>
                </div>
              )}
            </div>
          </div>

          {/* MODAL ADD ROLE */}
          {showAddRole && (
            <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Thêm role mới</h3>

                <input
                  className="w-full px-4 py-3 border rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 mb-4"
                  placeholder="Tên role..."
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddRole(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleAddRole}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Tạo mới
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
