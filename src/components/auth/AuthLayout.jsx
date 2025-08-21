import Logo from "../common/Logo";

const AuthLayout = ({ children, image, imageAlt }) => {
  return (
    <div className="h-screen flex w-full">
      <div className="w-full md:w-1/2 px-4 md:px-6 lg:px-20 md:py-8 py-4 overflow-auto">
        <Logo />
        {children}
      </div>
      <div className="w-1/2 hidden md:block rounded-l-4xl overflow-hidden">
        <img 
          src={image} 
          alt={imageAlt} 
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

// Uncomment the following lines to use Layout in a Authentation component/pages

// import AuthLayout from "./AuthLayout";
// import Image from "../../assets/login-exhibit.jpg"; depending on the consuming context(login or register or admin etc)

// const Login or Register = () => {
//     return (
//      <AuthLayout image={Image} imageAlt="Login Exhibit" children={
//     <div>Your Authentation Content</div>
// } />
//  );
// }
 
// export default Login;