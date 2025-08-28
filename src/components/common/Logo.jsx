import { Link } from "react-router-dom";
import LogoImage from "../../assets/logo.png";

const Logo = () => (
  <div className="w-20">
    <Link to="/">
      <img src={LogoImage} alt="StudEx Logo" className="w-full h-auto" />
    </Link>
  </div>
);

export default Logo;