import { Button, Divider, Form, Input } from "antd";
import { useState } from "react";

const Profile = () => {
  const [name, setName] = useState("Vũ");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("be********@gmail.com");
  const [birth, setBirth] = useState("**/**/2000");
  const [avatar, setAvatar] = useState<string | null>(null);
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Dung lượng file tối đa là 1MB!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
      <div className="p-4">
        <div className="">
          <h5>Hồ sơ của tôi</h5>
          <span>Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
        </div>
        <Divider />
        <div className="flex">
          <div className="w-[70%]">
            <div className="">
              <div className="mb-4">
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value="cr1vd_2kny"
                    readOnly
                    className="w-[70%] rounded border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tên Đăng nhập chỉ có thể thay đổi một lần.
                  </p> */}
                {/* Tên */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên
                  </label>{" "}
                  &nbsp;&nbsp;
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-[70%] rounded border-gray-300 bg-gray-100 px-3 py-2 text-gray-700 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Email */}
                <div className="mb-4 flex items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>

                    <p className="text-gray-700">{email}</p>
                  </div>
                  &nbsp;&nbsp;
                  <button className="text-blue-600 text-sm hover:underline">
                    Thay Đổi
                  </button>
                </div>

                {/* Số điện thoại */}
                <div className="mb-4 flex items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  &nbsp;&nbsp;
                  <button className="text-blue-600 text-sm hover:underline">
                    Thêm
                  </button>
                </div>

                {/* Giới tính */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <div className="flex items-center gap-4">
                    {["Nam", "Nữ", "Khác"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-1 text-gray-700"
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={gender === g}
                          onChange={() => setGender(g)}
                          className="text-orange-500 focus:ring-orange-500"
                        />
                        {g}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Ngày sinh */}
                <div className="mb-6 flex items-center">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày sinh
                    </label>
                    <p className="text-gray-700">{birth}</p>
                  </div>
                  &nbsp;&nbsp;
                  <button className="text-blue-600 text-sm hover:underline">
                    Thay Đổi
                  </button>
                </div>

                {/* Nút lưu */}
                <Button type="primary">Lưu</Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-start border-l-gray-500 pl-8 w-64">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center mb-3 border">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 0115 0"
                  />
                </svg>
              )}
            </div>

            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium py-1.5 px-4 rounded border">
              Chọn Ảnh
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <p className="text-xs text-gray-500 text-center mt-2 leading-tight">
              Dung lượng file tối đa là 1 MB <br />
              Định dạng: .JPEG, .PNG
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
