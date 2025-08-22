import teamPhoto from "@/assets/images/team-photo.jpg";
import misionPhoto from "@/assets/images/mission-photo.jpg";
import { values } from "@/data/values";
import ValueCard from "@/components/ui/ValueCard";
function AboutUs() {
  return (
    <div>
      <section className="flex flex-col my-10  justify-center items-center ">
        <p className=" text-purple-500 font-semibold text-[40px] leading-[100%] tracking-[0] ">
          About Us
        </p>
        <p className=" text-gray-500 font-normal text-[16px] lg:text-[18px] leading-[27px] tracking-[0] mx-15 lg:mx-55 mt-5 text-center">
          StudEx is a student-only marketplace where you can safely buy, sell,
          and find roommates within your school community. We make it easy to
          connect, save money, and get what you need without stress.
        </p>
      </section>
      <section className="mx-10">
        <img src={teamPhoto} alt="Team Photo" />
      </section>
      <section className="flex flex-col justify-center items-center my-10 bg-purple-200 py-20 gap-10">
        <div>
          <p className="font-semibold lg:text-[36px] text-[28px] leading-[100%] tracking-[0] text-center px-3">
            Making Student Life Easier and Safer
          </p>
          <p className="leading-[27px] tracking-[0] mx-15 lg:mx-55 mt-5 text-center text-gray-700">
            We’re building a safe, simple way for students to connect, share,
            and support each other.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center mx-20 gap-10 ">
          <div className="relative inline-block ">
            <div className="absolute inset-0 bg-purple-800 rounded-[15px] translate-x-[-15px] translate-y-[15px] "></div>
            <img
              className=" lg:w-7xl relative rounded-[15px]"
              src={misionPhoto}
              alt="Mission"
            />
          </div>

          <div className="lg:m-5">
            <p className="font-semibold text-purple-500 mb-3 text-center text-2xl lg:text-left">
              Our Mission
            </p>
            <p className="mb-6 text-gray-700 text-center lg:text-left ">
              To help students meet their everyday needs by creating a trusted
              space to trade items, share accommodation, and connect with others
              in their school community, making life on campus simpler and more
              affordable.
            </p>
            <p className="font-semibold text-center text-purple-500 mb-3 lg:text-left text-2xl">
              Our Vision
            </p>
            <p className="mb-10 text-gray-700 text-center lg:text-left">
              To build a connected student community where finding essentials or
              a roommate is easy, safe, and affordable, helping students focus
              on what truly matters, their studies and personal growth.
            </p>
          </div>
        </div>
      </section>
      <section className="flex gap-10 lg:gap-20 justify-center items-center flex-wrap  ">
        {values.map((val, idx) => (
          <ValueCard
            key={idx}
            icon={val.icon}
            title={val.title}
            description={val.description}
          />
        ))}
      </section>
    </div>
  );
}

export default AboutUs;
