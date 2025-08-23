import { Link } from "react-router-dom";
import FeatureCard from "../components/ui/FeatureCard";
import{ features } from "../sample data/features";
import bulletIcon from "../assets/icons/bullet-icon.svg";
import whyChooseImage from "../assets/images/WhyChooseImg.jpg";
import products from "../sample data/products";
import ProductCard from "../components/ui/ProductCard";


const Home = () => {
  // Why Choose data
const whyChoose = [
  {
    id: 1,
    text: "Save money, make money by reselling and buying smart.",
    icon: bulletIcon,
  },
  {
    id: 2,
    text: "Built for campus life, focused on student needs.",
    icon: bulletIcon,
  },
  {
    id: 3,
    text: "Find compatible roommates with ease.",
    icon: bulletIcon,
  },
  {
    id: 4,
    text: "Safe, peer-to-peer transactions with verified listings.",
    icon: bulletIcon,
  },
];

  return (
    <>
      <div className="text-3xl font-bold text-blue-600 p-4">
        Tailwind is working!
      </div>
      <Link to="/admin/login" className="m-10 p-2 rounded-md text-white bg-purple-500" >Admin login</Link>

      

      {/* Features section */}
         <section 
         className="px-6 md:px-12 lg:px-20 py-12 space-y-8">
         

         {/* Heading */}
         <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What You Can Do On <span className="text-[#9046CF]">StudEx</span>
          </h2>
           <p className="text-gray-600 max-w-2xl mx-auto">
            Buy smarter. Sell faster. Manage your listings and student essentials in one simple platform built for students, by students.
          </p>
         </div>

         {/* Feature cards grid */}
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <FeatureCard
               key={index}
               icon={feature.icon}
               title={feature.title}
               description={feature.description}
               variant={feature.variant}
            />
         ))}
        </div>
        </section>


         {/* Why Choose Studex Section */}
         <section className="px-6 md:px-12 lg:px-20 py-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">
            Why Choose <span className="text-[#9046CF]">StudEx</span>?
          </h2>
 <p className="text-gray-600 max-w-2xl mx-auto">
    From affordable deals to easy listings, everything students need in one place.
  </p>

  {/* Why Choose List */}
<ul className="space-y-3 text-left max-w-md mx-auto">
  {whyChoose.map((item) => (
    <li key={item.id} className="flex items-start gap-3">
      <img src={item.icon} alt="bullet" className="w-3 h-3 mt-1" />
      <span className="text-[#595959]">{item.text}</span>
    </li>
  ))}
</ul>

{/* Why Choose Image */}
<div className="mt-8 flex justify-center">
  <img src={whyChooseImage}
   alt="Mobile Screen"
   className="w-full max-w-md rounded-lg" />
</div>
         </section>

         

         {/* Products Section */}
<section className="px-6 md:px-12 lg:px-20 py-12 space-y-8">
  <h2 className="text-2xl md:text-3xl font-bold text-[#363636] text-center">
    All You Need in One Place
  </h2>
  <p className="text-[#595959] text-center max-w-xl mx-auto">
    Find roommates, furniture, and deals from real students near you.
  </p>

  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {products.map((product) => (
      <ProductCard key={product.id} {...product} />
    ))}
  </div>

  <div className="flex justify-center">
    <button className="bg-[#9046CF] text-white font-semibold py-2 px-8 rounded-lg hover:bg-purple-700 transition min-w-[670px]">
      Browse Listings
    </button>
  </div>
</section>
    </>
  );
};

export default Home;
