import React, { useState } from 'react';

const SignIn: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!agree) {
            alert('Bạn cần đồng ý với điều khoản & chính sách trước khi đăng nhập.');
            return;
        }
        // Xử lý đăng nhập, gửi dữ liệu tới backend
        console.log('Đăng nhập với:', { phone, password });
        // Reset form
        setPhone('');
        setPassword('');
        setAgree(false);
    };

    return (
        <div className="form-container sign-in">
            <form id="signin-form" onSubmit={handleSubmit}>
                <h1>Đăng nhập</h1>
                <div className="social-icons">
                    <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
                    <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
                <span>hoặc sử dụng email của bạn để đăng nhập</span>
                <input
                    type="email"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label className="terms">
                    <input
                        type="checkbox"
                        id="signin-agree"
                        name="signin-agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        required
                    />
                    <span>Tôi đồng ý với</span> <a href="#">điều khoản & chính sách</a>
                </label>
                <a className="forget-your-password" href="#">Quên mật khẩu?</a>
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
};

export default SignIn;
