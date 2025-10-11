import {useNavigate} from "react-router-dom";
import Header from "@/components/common/Header";
import Hero from "@/components/ui/HeroSection";
import FeatureCard from "@/components/ui/FeatureCard";
import { features } from "@/sample-data/features";
import whyChoose from "@/sample-data/whyChoose";
import whyChooseImage from "@/assets/images/WhyChooseImg.jpg";
import products from "@/sample-data/products";
import ProductCard from "@/components/ui/ProductCard";
import Banner from "@/components/common/Banner";
import Footer from "@/components/ui/Footer";
import PreFooter from "@/components/ui/PreFooter";
import Testimonial from "@/components/ui/TestimonialCard";
import FAQ from "@/components/ui/FAQitem";
import ScrollToTopButton from "@/components/common/ScrollToTopButton";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  }
  return (
    <>
      <main className="w-full bg-accent">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section>
          <Hero />
        </section>

        {/* Banner */}
        <Banner />

        {/* Features section */}
        <section className="px-4 md:px-12 lg:px-20 py-12">
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
        <section
          id="why-studex"
          className="px-4 md:px-12 lg:px-20 py-6 md:py-12 lg:py-20 flex justify-center"
        >
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
        <section className="px-4 md:px-12 lg:px-12 py-12 space-y-6">
          <h2 className="text-2xl md:text-3xl lg:md:text-4xl font-semibold text-[#363636] text-center">
            All You Need in One Place
          </h2>
          <p className="text-[#595959] text-base text-center max-w-xl mx-auto pb-6">
            Find roommates, furniture, and deals from real students near you.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => handleNavigation("/items")}
              className="bg-[#9046CF] text-white font-semibold py-3  rounded-lg hover:bg-purple-700 w-full md:w-[30%] transition-all duration-200 cursor-pointer"
            >
              Browse Listings
            </button>
          </div>
        </section>

        <Banner />
        <Testimonial />
        <FAQ />
      </main>
      {/* Footer Section */}
      <PreFooter />
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </>
  );
};

export default Home;
