import logo from "../../app/icons/admin/logo.png";

const Header = () => {
  return (
    <div className="fixed h-[76px] top-0 left-0 w-full bg-[#0A7D9E] flex items-center justify-center p-3 z-50">
      <div className="flex gap-[32px] items-center space-x-3">
        <img src={logo} alt="Logo" className="w-[106px] h-[48px]" />
        <span className="text-white text-[28px] font-roboto font-bold">
          Администратор
        </span>
      </div>
    </div>
  );
};

export default Header;
