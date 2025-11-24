import { useEffect, useState } from "react";
import {
  getAddressesByUserIdAPI,
  createAddressAPI,
  updateAddressAPI,
  deleteAddressAPI,
  setDefaultAddressAPI,
} from "../../service/api";
import { useCurrentApp } from "../../components/context/app.context";
import { MapPin, Plus, Home } from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";
import AddressFormModal from "../../components/section/user/addresss/AddressFormModal";
import AddressItem from "../../components/section/user/addresss/AddressItem";

const MAX_ADDRESS_LIMIT = 5; // Định nghĩa giới hạn

const Address = () => {
  const { user, showToast } = useCurrentApp();

  // DATA STATE
  const [addresses, setAddresses] = useState<IAddress[]>([]);

  // MODAL STATES
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);

  // LOAD DATA
  useEffect(() => {
    if (user && user.id) loadAddresses(user.id);
  }, [user]);

  const loadAddresses = async (userId: number) => {
    try {
      const res = await getAddressesByUserIdAPI(userId);
      if (Array.isArray(res?.data?.data))
        setAddresses(res.data.data as IAddress[]);
      else if (Array.isArray(res?.data)) setAddresses(res.data as IAddress[]);
      else setAddresses([]);
    } catch {
      setAddresses([]);
    }
  };

  // --- HANDLERS FOR ACTIONS ---

  // 1. Open Create Modal (CẬP NHẬT LOGIC CHECK LIMIT)
  const handleOpenCreate = () => {
    if (addresses.length >= MAX_ADDRESS_LIMIT) {
      showToast(
        `Bạn chỉ được tạo tối đa ${MAX_ADDRESS_LIMIT} địa chỉ!`,
        "warning"
      );
      return;
    }
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  // 2. Open Edit Modal
  const handleOpenEdit = (addr: IAddress) => {
    setEditingAddress(addr);
    setIsFormOpen(true);
  };

  // 3. Submit Form
  const handleFormSubmit = async (formData: IAddressPayload) => {
    if (!user) {
      showToast("Vui lòng đăng nhập!", "error");
      return;
    }

    const payload = { ...formData, user: { id: user.id } };

    try {
      if (editingAddress) {
        // UPDATE
        const res = await updateAddressAPI(editingAddress.id, payload);
        if (res.data) {
          showToast("Cập nhật địa chỉ thành công", "success");
          loadAddresses(user.id);
          setIsFormOpen(false);
        }
      } else {
        // CREATE
        const res = await createAddressAPI(payload);
        if (res.data) {
          showToast("Thêm địa chỉ mới thành công", "success");
          loadAddresses(user.id);
          setIsFormOpen(false);
        }
      }
    } catch {
      showToast("Có lỗi xảy ra, vui lòng thử lại.", "error");
    }
  };

  // 4. Delete Logic
  const handleOpenDelete = (id: number) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteAddressAPI(idToDelete);
      showToast("Đã xóa địa chỉ thành công", "success");
      user && loadAddresses(user.id);
    } catch {
      showToast("Xóa thất bại.", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    }
  };

  // 5. Set Default Logic
  const handleSetDefault = async (id: number) => {
    if (!user) return;
    try {
      const res = await setDefaultAddressAPI(id);
      if (res.data) {
        showToast("Đã thay đổi địa chỉ mặc định", "success");
        loadAddresses(user.id);
      }
    } catch {
      showToast("Cập nhật thất bại.", "error");
    }
  };

  // Tính toán xem đã đạt giới hạn chưa
  const isLimitReached = addresses.length >= MAX_ADDRESS_LIMIT;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* HEADER */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-green-50/50">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1.5 rounded-full text-green-600">
            <MapPin size={20} />
          </div>
          <h5 className="text-lg font-bold text-gray-800">
            Sổ địa chỉ{" "}
            <span className="text-sm font-normal text-gray-500">
              ({addresses.length}/{MAX_ADDRESS_LIMIT})
            </span>
          </h5>
        </div>

        {/* NÚT THÊM MỚI (CẬP NHẬT UI DISABLED) */}
        <button
          onClick={handleOpenCreate}
          disabled={isLimitReached}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-white text-sm font-medium transition-all shadow-md ${
            isLimitReached
              ? "bg-gray-400 cursor-not-allowed shadow-none"
              : "bg-green-600 hover:bg-green-700 shadow-green-200"
          }`}
          title={
            isLimitReached
              ? "Đã đạt giới hạn số lượng địa chỉ"
              : "Thêm địa chỉ mới"
          }
        >
          <Plus size={16} />
          Thêm mới
        </button>
      </div>

      {/* LIST ADDRESSES */}
      <div className="p-5 bg-white min-h-[200px]">
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Home size={40} className="mb-2 text-gray-300" />
            <p className="text-sm">Chưa có địa chỉ nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {addresses.map((addr) => (
              <AddressItem
                key={addr.id}
                address={addr}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onSetDefault={handleSetDefault}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      <AddressFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xóa địa chỉ"
        message="Bạn có chắc chắn muốn xóa địa chỉ này? Hành động này không thể hoàn tác."
      />
    </div>
  );
};

export default Address;
