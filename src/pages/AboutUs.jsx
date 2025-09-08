import Header from "@/components/common/Header";
import teamPhoto from "@/assets/images/team-photo.jpg";
import teamPhotoSmall from "@/assets/images/team-photo-small.jpg";
import misionPhoto from "@/assets/images/mission-photo.jpg";
import { values } from "@/data/values";
import ValueCard from "@/components/ui/ValueCard";
import Footer from "@/components/ui/Footer";
import PreFooter from "@/components/ui/PreFooter";
function AboutUs() {
  return (
    <div>
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <section className="flex flex-col my-10  justify-center items-center ">
        <p className=" text-purple-500 font-semibold text-[32px] lg:text-[40px] leading-[100%] tracking-[0] ">
          About Us
        </p>
        <p className=" text-gray-500 font-normal text-[14px] lg:text-[18px] leading-[27px] tracking-[0] mx-3 lg:mx-0 lg:w-3xl mt-3 text-center">
          StudEx is a student-only marketplace where you can safely buy, sell,
          and find roommates within your school community. We make it easy to
          connect, save money, and get what you need without stress.
        </p>
      </section>
      <section className="mx-10">
        <picture>
          <source media="(max-width: 640px)" srcSet={teamPhotoSmall} />
          <source media="(max-width: 1024px)" srcSet={teamPhoto} />
          <img
            src={teamPhoto}
            alt="Hero banner"
            className="w-full rounded-2xl shadow-lg"
          />
        </picture>
      </section>
      <section className="flex flex-col justify-center items-center my-10 bg-purple-100 lg:bg-purple-200 py-10 gap-10">
        <div>
          <p className="font-semibold lg:text-[36px] text-[24px] leading-[100%] tracking-[0] text-center text-gray-700 px-3">
            Making Student Life Easier and Safer
          </p>
          <p className="leading-[27px] tracking-[0] mx-15 text-[14px] lg:mx-55 lg:text-[18px] mt-5 text-center text-gray-700">
            We’re building a safe, simple way for students to connect, share,
            and support each other.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center mx-10 gap-10 ">
          <div className="relative inline-block ">
            <div className="absolute inset-0 bg-purple-800 rounded-[15px] translate-x-[-15px] translate-y-[15px] "></div>
            <img
              className=" lg:w-7xl relative rounded-[15px]"
              src={misionPhoto}
              alt="Mission"
            />
          </div>

          <div>
            <p className="font-semibold text-purple-500 mb-3 lg:text-[28px] text-left text-[18px]">
              Our Mission
            </p>
            <p className="mb-6 text-gray-700 text-[14px] lg:text-[16px] text-left ">
              To help students meet their everyday needs by creating a trusted
              space to trade items, share accommodation, and connect with others
              in their school community, making life on campus simpler and more
              affordable.
            </p>
            <p className="font-semibold text-[18px] text-purple-500 mb-3 text-left lg:text-[28px]">
              Our Vision
            </p>
            <p className=" text-[14px] text-gray-700 text-left lg:text-[16px] ">
              To build a connected student community where finding essentials or
              a roommate is easy, safe, and affordable, helping students focus
              on what truly matters, their studies and personal growth.
            </p>
          </div>
        </div>
      </section>
      <section className="flex gap-10 lg:gap-15 justify-center items-center flex-wrap  ">
        <div>
          <p className="text-[23.93px] lg:text-[36px] text-center mb-2 font-semibold text-gray-700">
            Our Core Values
          </p>
          <p className="text-[13.96px] lg:text-[18px] mx-5 text-gray-600 lg:px-45 text-center ">
            What matters most to us, creating a safe, trusted, and supportive
            space where students can find exactly what they need.
          </p>
        </div>
        {values.map((val, idx) => (
          <ValueCard
            key={idx}
            icon={val.icon}
            title={val.title}
            description={val.description}
          />
        ))}
      </section>
            {/* Footer Section */}
      <PreFooter />
      <Footer/>
    </div>
  );
}

export default AboutUs;
