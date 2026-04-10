import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn 
} from "react-icons/fa6";
import { 
  HiOutlineEnvelope, 
  HiOutlinePhone, 
  HiOutlineMapPin 
} from "react-icons/hi2";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Logo & About */}
          <div className="space-y-6">
            <a className="flex items-center space-x-2" href="/">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <span className="text-2xl font-black tracking-tight">Homely</span>
            </a>
            <p className="text-slate-400 font-medium leading-relaxed">
              Nền tảng tìm kiếm phòng trọ và căn hộ hàng đầu Việt Nam. Chúng tôi giúp bạn tìm thấy không gian sống lý tưởng một cách nhanh chóng và an toàn.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: FaFacebookF, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaInstagram, href: "#" },
                { icon: FaLinkedinIn, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-bold mb-6">Khám phá</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <a className="hover:text-white transition-colors" href="/search">
                  Tìm phòng
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="/post-listing">
                  Đăng tin cho thuê
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="/blog">
                  Mẹo thuê trọ
                </a>
              </li>
              <li>
                <a className="hover:text-white transition-colors" href="/about">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-6">Hỗ trợ</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  An toàn & Tin cậy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">Liên hệ</h3>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex items-center space-x-3">
                <HiOutlineEnvelope className="w-5 h-5 text-blue-500" />
                <span>contact@homely.vn</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlinePhone className="w-5 h-5 text-blue-500" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineMapPin className="w-5 h-5 text-blue-500" />
                <span>Quận 1, TP. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-medium">
          <p>© 2026 Homely. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
