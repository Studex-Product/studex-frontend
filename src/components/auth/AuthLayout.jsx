import Logo from "../common/Logo";
import Image from '../../assets/hero-images/Image.png'

const AuthLayout = ({ children,  imageAlt }) => {
  return (
    <div className="h-screen flex w-full">
      <div className="w-full md:w-1/2 px-4 md:px-8 lg:px-20 py-8">
        <Logo />
        {children}
      </div>
      <div className="w-1/2 hidden md:block rounded-l-4xl overflow-hidden">
        <img 
          src={Image}
          alt={imageAlt} 
          className="h-full w-full object-fill aspect-auto"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

// Uncomment the following lines to use Layout in a Authentication component/pages

// import AuthLayout from "./AuthLayout";
// import Image from "../assets/login-exhibit.jpg"; //depending on the consuming context(login or register or admin etc)

// const  Register = () => {
//     return (
//      <AuthLayout image={Image} imageAlt="Login Exhibit" children={
//     <div>Your Authentication Content</div>
// } />
//  );
// }
 
// export default Register;
