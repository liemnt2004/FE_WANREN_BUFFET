import React, { useState, useContext } from "react";
import "../layouts/customer/assets/css/LoginEmployee.css";
import khichi from "../layouts/customer/assets/img/warenbuffet.png";
import { AuthContext } from "../layouts/customer/component/AuthContext";

const EmployeeLoginComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  // Xóa state signInData không sử dụng
  // const [signInData, setSignInData] = useState({
  //     username: '',
  //     password: '',
  // });

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      // Gọi API đăng nhập
      const response = await fetch("https://wanrenbuffet.online/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Giả sử API trả về token trong thuộc tính 'token'

        // Sử dụng hàm login từ AuthContext để lưu thông tin nhân viên
        login(token, true); // Tham số thứ hai là isEmployee = true
      } else {
        // Xử lý lỗi từ API
        const errorData = await response.json();
        setError(errorData.message || "Đăng nhập thất bại");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Đã xảy ra lỗi khi đăng nhập");
    }
  };

  return (
    <section
      className="gradient-form "
      style={{ backgroundColor: "#eee" }}
    >
      <div className="container py-5 h-100  container-fluid" >
        <div className="row d-flex justify-content-center align-items-center h-100 ">
          <div className="col-xl-10">
            <div className="card rounded-3 text-black">
              <div className="row g-0">
                <div className="col-lg-6">
                  <div className="card-body p-md-5 mx-md-4">
                    <div className="text-center">
                      <img src={khichi} style={{ width: "185px" }} alt="logo" />
                      <h4 className="mt-1 mb-5 pb-1">Đăng Nhập Nhân Viên</h4>
                    </div>

                    <form onSubmit={handleLogin}>
                      {error && (
                        <div className="alert alert-danger">{error}</div>
                      )}

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="username">
                          Tên Đăng Nhập
                        </label>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className="form-label" htmlFor="password">
                          Mật Khẩu
                        </label>
                      </div>

                      <div className="text-center pt-1 mb-5 pb-1">
                        <button
                          className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3"
                          type="submit"
                        >
                          Đăng Nhập
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="col-lg-6 d-flex align-items-center gradient-custom-2">
                  <div className="text-white px-3 py-4 p-md-5 mx-md-4">
                    <img src={khichi} alt="Employee" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeeLoginComponent;
