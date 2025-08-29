import { Link } from "react-router-dom";
import Header from "../components/common/Header";
import Hero from "../components/ui/HeroSection";
import FeatureCard from "../components/ui/FeatureCard";
import { features } from "../sample data/features";
import whyChoose from "../sample data/whyChoose";
import whyChooseImage from "../assets/images/WhyChooseImg.jpg";
import products from "../sample data/products";
import ProductCard from "../components/ui/ProductCard";
import Banner from "@/components/common/Banner";

const Home = () => {
  return (
    <>
      <main className="">
        {/* <div className="text-3xl font-bold text-blue-600 p-4">
        Tailwind is working!
      </div>
      <Link
        to="/admin/login"
        className="m-10 p-2 rounded-md text-white bg-purple-500"
      >
        Admin login
      </Link>
      <Link
        to="/about"
        className="m-10 p-2 rounded-md text-white bg-purple-500"
      >
        About Us
      </Link> */}

        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section>
          <Hero />
        </section>

        {/* Banner */}
        <Banner />

        {/* Features section */}
        <section className="px-6 md:px-12 lg:px-20 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Heading */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                What You Can Do On{" "}
                <span className="text-[#9046CF]">StudEx</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Buy smarter. Sell faster. Manage your listings and student
                essentials in one simple platform built for students, by
                students.
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
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-around gap-10">
            {/* Heading */}
            <div className="space-y-6 w-full md:w-1/2 text-center lg:text-left flex flex-col">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium ">
                Why Choose <span className="text-[#9046CF]">StudEx</span>
              </h2>
              <p className="text-gray-600  md:mr-12">
                From affordable deals to easy listings, everything students need
                in one place.
              </p>

              {/* Why Choose List */}
              <ul className="space-y-3 ">
                {whyChoose.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    <img
                      src={item.icon}
                      alt="bullet"
                      className="w-3 h-3 mt-1"
                    />
                    <span className="text-[#595959]">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Image */}
            <div className=" md:w-1/2 w-full flex items-center justify-center">
              <img
                src={whyChooseImage}
                alt="Mobile Screen"
                className="w-full h-full rounded-lg"
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
            <button className="bg-[#9046CF] text-white font-semibold py-2 px-8 rounded-lg hover:bg-purple-700 transition max-w-[550px]">
              Browse Listings
            </button>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
