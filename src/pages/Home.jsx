import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="text-3xl font-bold text-blue-600 p-4">
        Tailwind is working!
      </div>
      <Link to="/admin/login" className="m-10 p-2 rounded-md text-white bg-purple-500" >Admin login</Link>
    </>
  );
};

export default Home;
