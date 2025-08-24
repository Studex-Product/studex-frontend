import { Link } from "react-router-dom";
import FeatureCard from "../components/ui/FeatureCard";
import{ features } from "../sample data/features";
import whyChoose from "../sample data/whyChoose";
import whyChooseImage from "../assets/images/WhyChooseImg.jpg";
import products from "../sample data/products";
import ProductCard from "../components/ui/ProductCard";


const Home = () => {

  return (
    <>
      <div className="text-3xl font-bold text-blue-600 p-4">
        Tailwind is working!
      </div>
      <Link to="/admin/login" className="m-10 p-2 rounded-md text-white bg-purple-500" >Admin login</Link>

      

     {/* Features section */}
<section className="px-6 md:px-12 lg:px-20 py-12">
  <div className="max-w-6xl mx-auto space-y-8">
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
        />
      ))}
    </div>
  </div>
</section>



        {/* Why Choose StudEx Section */}
<section className="px-6 md:px-12 lg:px-20 py-12 flex justify-center">
  <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 items-start gap-10">
    
    {/* Heading */}
    <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
      <h2 className="text-2xl md:text-3xl font-bold">
        Why Choose <span className="text-[#9046CF]">StudEx</span>
      </h2>
      <p className="text-gray-600 max-w-md">
        From affordable deals to easy listings, everything students need in one place.
      </p>

      {/* Why Choose List */}
      <ul className="space-y-3">
        {whyChoose.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <img src={item.icon} alt="bullet" className="w-3 h-3 mt-1" />
            <span className="text-[#595959]">{item.text}</span>
          </li>
        ))}
      </ul>
    </div>

    {/* Image */}
    <div className="flex justify-center lg:justify-end">
      <img
        src={whyChooseImage}
        alt="Mobile Screen"
        className="w-full max-w-md rounded-lg"
      />
    </div>
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
    <button className="bg-[#9046CF] text-white font-semibold py-2 px-8 rounded-lg hover:bg-purple-700 transition min-w-[550px]">
      Browse Listings
    </button>
  </div>
</section>
    </>
  );
};

export default Home;
