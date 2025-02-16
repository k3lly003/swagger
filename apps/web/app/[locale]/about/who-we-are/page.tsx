import { getDictionary } from "@/lib/get-dictionary";
import Image from "next/image";
import { PersonIcon, BikeIcon } from "@/components/ui/icons";
import { DecoratedHeading } from "@/components/layout/headertext";
import LanguageSwitcher from "@/components/layout/language-switcher";
import BuildingSolutionsSection from "@/components/sections/BuildingSolutionsSection";
import { default as HeaderBelt } from "@/components/layout/headerBelt";

import { FC } from "react";

// Types for props
interface MissionCardProps {
  bgColor: string;
  labelColor: string;
  iconColor: string;
  textColor?: string;
  label: string;
  content: string;
  hasCurvedCorner?: boolean;
}

interface ValueCardProps {
  bgColor: string;
  iconBgColor: string;
  iconColor?: string;
  title: string;
  titleColor: string;
  textColor?: string;
  description: string;
}

interface FloatingTagProps {
  text: string;
  position: string;
  color: string;
  rotate?: string;
}

interface PromiseCardProps {
  type: "partners" | "fellows";
  items?: string[];
  content?: string | string[];
  hasCurvedCorner?: boolean;
}

interface PageProps {
  params: Promise<{ locale: string }>;
}

// Reusable Mission Card component
const MissionCard: FC<MissionCardProps> = ({
  bgColor,
  labelColor,
  iconColor,
  textColor = "text-gray-900",
  label,
  content,
  hasCurvedCorner = false,
}) => (
  <div className="relative">
    <div className={`${bgColor} rounded-3xl p-6 sm:p-8 overflow-hidden`}>
      <div className="flex items-center mb-4 sm:mb-6">
        <div
          className={`${labelColor} text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 flex items-center justify-center text-xs sm:text-sm font-medium`}
        >
          <span className="mr-2">●</span> {label}
        </div>
      </div>

      <p className={`text-lg sm:text-xl font-bold ${textColor}`}>{content}</p>

      {hasCurvedCorner && (
        <div
          className="absolute top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 bg-white"
          style={{
            borderBottomLeftRadius: "100%",
          }}
        ></div>
      )}

      {/* Circular icon */}
      <div
        className={`absolute -top-4 -right-4 ${iconColor} rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shadow-lg`}
      >
        <BikeIcon className="w-8 h-8 sm:w-10 sm:h-10" />
      </div>
    </div>
  </div>
);

// Reusable Value Card component
const ValueCard: FC<ValueCardProps> = ({
  bgColor,
  iconBgColor,
  iconColor = "white",
  title,
  titleColor,
  textColor = "text-gray-800",
  description,
}) => (
  <div
    className={`w-full md:w-1/3 ${bgColor} rounded-3xl p-6 sm:p-8 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer mb-6 md:mb-0`}
  >
    <div className="flex justify-center mb-4 sm:mb-6">
      <div
        className={`${iconBgColor} rounded-full w-16 h-16 sm:w-24 sm:h-24 flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-110`}
      >
        <BikeIcon
          className="w-10 h-10 sm:w-14 sm:h-14 transition-transform duration-300 hover:scale-125"
          color={iconColor}
        />
      </div>
    </div>

    <h3
      className={`text-xl sm:text-2xl font-bold text-center ${titleColor} mb-3 sm:mb-4 transition-colors duration-300 hover:text-yellow-500`}
    >
      {title}
    </h3>

    <p
      className={`${textColor} text-center text-sm sm:text-base transition-all duration-300 hover:font-medium`}
    >
      {description}
    </p>
  </div>
);

// Promise Card component
const PromiseCard: FC<PromiseCardProps> = ({
  type,
  items,
  content,
  hasCurvedCorner = false,
}) => {
  const bgColor = type === "partners" ? "bg-yellow-50" : "bg-green-800";
  const labelColor = type === "partners" ? "bg-primary-orange" : "bg-green-500";
  const textColor = type === "partners" ? "text-gray-800" : "text-white";
  const label = `Promise to ${type}`;

  if (type === "partners" && items) {
    return (
      <div className={`${bgColor} rounded-3xl p-4 sm:p-6`}>
        <div className="flex items-center mb-3 sm:mb-4">
          <div
            className={`${labelColor} text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 flex items-center justify-center text-xs font-bold`}
          >
            {label}
          </div>
        </div>

        <ul className="space-y-4 sm:space-y-6">
          {items.map((item, index) => (
            <li key={index} className="flex items-start">
              <span className="text-black font-bold mr-2 sm:mr-3 mt-1">•</span>
              <span className="text-gray-800 font-medium text-sm sm:text-lg">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`${bgColor} ${textColor} rounded-3xl p-4 sm:p-6 overflow-hidden`}
      >
        <div className="flex items-center mb-3 sm:mb-4">
          <div
            className={`${labelColor} text-white rounded-full px-3 py-1 sm:px-4 sm:py-2 flex items-center justify-center text-xs font-bold`}
          >
            {label}
          </div>
        </div>

        {Array.isArray(content) ? (
          <ul className="space-y-3 sm:space-y-4">
            {content.map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-white font-bold mr-2 sm:mr-3 mt-1">
                  •
                </span>
                <span className="text-white font-medium text-sm sm:text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-lg sm:text-xl font-bold">{content}</p>
        )}

        {hasCurvedCorner && (
          <div
            className="absolute top-0 right-0 w-10 h-10 sm:w-16 sm:h-16 bg-white"
            style={{
              borderBottomLeftRadius: "100%",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default async function AboutPage(props: PageProps) {
  const params = await props.params;

  const {
    locale
  } = params;

  const dict = await getDictionary(locale);

  // Tag data with translations
  const tags = [
    // Yellow
    {
      text: dict?.about?.tags?.youth_empowerment || "Youth Empowerment",
      color: "bg-primary-orange",
      position: "left-56 bottom-10",
      rotate: "-5deg",
    },
    {
      text: dict?.about?.tags?.land_management || "Land Management",
      color: "bg-primary-orange",
      position: "left-64 bottom-20",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.peer_learning || "Peer to peer learning",
      color: "bg-primary-orange",
      position: "left-1/3 top-20",
      rotate: "8deg",
    },
    {
      text: dict?.about?.tags?.food_systems || "Food systems",
      color: "bg-primary-orange",
      position: "right-32 bottom-16",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.stewardship || "Stewardship",
      color: "bg-primary-orange",
      position: "left-1/2 bottom-20",
      rotate: "5deg",
    },

    // Green
    {
      text: dict?.about?.tags?.system_thinking || "System Thinking",
      color: "bg-primary-green",
      position: "left-36 top-24",
      rotate: "-8deg",
    },
    {
      text: dict?.about?.tags?.data_literacy || "Data Literacy",
      color: "bg-primary-green",
      position: "left-1/4 bottom-10",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.land_rights || "Land Rights",
      color: "bg-green-800",
      position: "right-48 top-16",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.networking || "Networking",
      color: "bg-primary-green",
      position: "left-1/3 bottom-10",
      rotate: "3deg",
    },
    {
      text: dict?.about?.tags?.evidence_based || "Evidence-based",
      color: "bg-primary-green",
      position: "left-1/2 bottom-10",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.co_creation || "Co-creation",
      color: "bg-primary-green",
      position: "right-1/3 bottom-20",
      rotate: "0deg",
    },
    {
      text: dict?.about?.tags?.agriculture || "Agriculture",
      color: "bg-primary-green",
      position: "right-20 top-24",
      rotate: "-4deg",
    },
    {
      text: dict?.about?.tags?.mentorship || "Mentorship",
      color: "bg-primary-green",
      position: "right-1/4 bottom-10",
      rotate: "0deg",
    },
  ];

  // Categories for the banner with translations
  const categories = [
    dict?.about?.categories?.environment || "Environment",
    dict?.about?.categories?.agriculture || "Agriculture",
    dict?.about?.categories?.land || "Land",
    dict?.about?.categories?.food_system || "Food system",
    dict?.about?.categories?.climate || "Climate",
  ];

  return (
    <main className="flex flex-col min-h-screen">
      {/* Language Switcher */}
      <div className="flex justify-end p-4">
        <LanguageSwitcher />
      </div>
      {/* Hero Section */}
      <section className="relative w-full h-[400px] sm:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/team.png"
            alt="Agricultural fields"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

        {/* Content */}
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center z-20">
          <h1 className="text-white text-2xl sm:text-3xl md:text-4xl mb-2 leading-tight">
            <span className="font-bold text-yellow-400">Empowering</span>{" "}
            <span className="font-normal">Africa's Future</span>
            <br />
            <span className="font-normal">Through</span>{" "}
            <span className="font-bold text-yellow-400">Transformative</span>
          </h1>
          <h2 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider mt-6">
            WHO WE ARE
          </h2>
        </div>
      </section>

      <HeaderBelt />
      
      {/* Our Approach Section with circular images */}
      <section className="py-8 md:py-12 ">
  <div className="container mx-auto px-4">
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left side - Images (hidden on mobile, visible on lg screens) */}
      <div className="hidden lg:block lg:w-1/2">
        <div className="relative mx-auto" style={{ width: 'fit-content' }}>
          <div className="rounded-full overflow-hidden w-[300px] h-[300px] md:w-[400px] md:h-[400px] border-4 border-transparent">
            <Image
              src="/images/team.png"
              alt="Hands holding grain"
              width={400}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute -bottom-10 -left-10 rounded-full overflow-hidden w-[120px] h-[120px] md:w-[150px] md:h-[150px] border-4 border-green-700">
            <Image
              src="/images/1.jpg"
              alt="Smiling person"
              width={150}
              height={150}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Right side - Text content (full width on mobile, half on lg screens) */}
      <div className="w-full lg:w-1/2">
        <div className="flex justify-left mb-4">
          <DecoratedHeading
            firstText={
              dict?.about?.transformative_partner?.heading_first ||
              "A Transformative"
            }
            secondText={
              dict?.about?.transformative_partner?.heading_second || "Partner"
            }
          />
        </div>
        <div className="max-w-full lg:max-w-xl space-y-4 text-justify">
          <p className="text-gray-700 text-sm sm:text-base">
            {dict?.about?.transformative_partner?.paragraph_1 ||
              "Africa is a young, fast-growing continent with almost boundless potential. To take full advantage of the opportunities ahead, African leaders need to address several priorities, including creating impactful jobs for youth and improving agriculture, which employs more Africans than any other sector. GanzAfrica offers an innovative training, mentorship, and work placement program that meets both pressing needs at once—and prepares African youth to take the future in their hands."}
          </p>

          <p className="text-gray-700 text-sm sm:text-base">
            {dict?.about?.transformative_partner?.paragraph_2 ||
              "GanzAfrica provides holistic career preparation for transformative food systems leaders. Our curriculum integrates best practices around agriculture, the environment, sustainable land management, and land rights to break siloed patterns of thinking and unlock opportunities at the intersections of these fields. We stress data literacy and analytical capabilities to equip youth with the necessary skills to provide the right support to state and non-state organizations to make evidence-based decisions."}
          </p>

          <p className="text-gray-700 text-sm sm:text-base">
            {dict?.about?.transformative_partner?.paragraph_3 ||
              "Our program also connects fellows to a rich community of mentors and places them in government and non-government sector jobs where they gain both real-world experience and the beginnings of a professional network."}
          </p>

          <p className="text-gray-700 text-sm sm:text-base">
            {dict?.about?.transformative_partner?.paragraph_4 ||
              "In the end, GanzAfrica connects youth to fulfilling careers that draw on their passion and skills to deliver on the promise of a healthy, prosperous future for the continent."}
          </p>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* OUR ASPIRATIONS SECTION */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="flex justify-center mb-6 sm:mb-8 md:mb-12">
          <div className="relative inline-block">
            <div className="flex justify-center">
              <DecoratedHeading
                firstText={dict?.about?.aspirations?.heading_first || "Our"}
                secondText={
                  dict?.about?.aspirations?.heading_second || "Aspirations"
                }
              />
            </div>
          </div>
        </div>

        <div className="w-full px-4">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 max-w-7xl mx-auto">
            {/* Left side - Team Image */}
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <div className="rounded-3xl overflow-hidden h-[300px] sm:h-[400px] md:h-[500px]">
                <Image
                  src="/images/team.png"
                  alt="GanzAfrica team members"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right side - Mission Cards */}
            <div className="w-full md:w-1/2 flex flex-col space-y-6 sm:space-y-8">
              <MissionCard
                bgColor="bg-yellow-50"
                labelColor="bg-primary-orange"
                iconColor="bg-primary-orange"
                label={dict?.about?.aspirations?.mission_label || "Our Mission"}
                content={
                  dict?.about?.aspirations?.mission_1 ||
                  "To advance a prosperous and sustainable food systems transformation in Africa through locally driven, system-focused solutions"
                }
              />

              <MissionCard
                bgColor="bg-green-800"
                labelColor="bg-green-500"
                iconColor="bg-green-600"
                textColor="text-white"
                label={dict?.about?.aspirations?.mission_label || "Our Mission"}
                content={
                  dict?.about?.aspirations?.mission_2 ||
                  "To strengthen institutions, and the individuals who will shape and lead them, by equipping and placing youth with data-driven, systems-focused skills for improving food systems."
                }
                hasCurvedCorner={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES SECTION */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="flex justify-center mb-8 sm:mb-12 md:mb-16">
          <div className="relative inline-block">
            <div className="flex justify-center mb-6 sm:mb-10">
              <DecoratedHeading
                firstText={dict?.about?.values?.heading_first || "Our"}
                secondText={dict?.about?.values?.heading_second || "Values"}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8 max-w-7xl mx-auto">
            <ValueCard
              bgColor="bg-yellow-50"
              iconBgColor="bg-primary-orange"
              title={dict?.about?.values?.evidence_title || "Evidence based"}
              titleColor="text-primary-orange"
              description={
                dict?.about?.values?.evidence_description ||
                "In-depth research and data-driven insights shape the solutions we co-create, leveraging local knowledge and building analytical expertise to ensure the best possible outcomes."
              }
            />

            <ValueCard
              bgColor="bg-green-800"
              iconBgColor="bg-white"
              iconColor="#006837"
              title={dict?.about?.values?.integrity_title || "Integrity"}
              titleColor="text-white"
              textColor="text-white"
              description={
                dict?.about?.values?.integrity_description ||
                "We work with authenticity and transparency. We are collaborative but not subject to influence or partiality."
              }
            />

            <ValueCard
              bgColor="bg-yellow-50"
              iconBgColor="bg-primary-orange"
              title={dict?.about?.values?.stewardship_title || "Stewardship"}
              titleColor="text-primary-orange"
              description={
                dict?.about?.values?.stewardship_description ||
                "We pattern the highest respect for human, financial, and natural resources and diligence in their utilization. The solutions we co-create enshrine this, alongside equality of access to resources now and for the future."
              }
            />
          </div>
        </div>
      </section>
      

      {/* Our Approach Grid Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center mb-6 sm:mb-10">
            <DecoratedHeading
              firstText={dict?.about?.approach?.heading_first || "Our"}
              secondText={dict?.about?.approach?.heading_second || "Approach"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2">
            {/* Left Column - Identify */}
            <div>
              <div
                style={{ backgroundColor: "#FFFDEB" }}
                className="p-4 sm:p-6 h-auto sm:h-60 md:h-80"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary-orange rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <PersonIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary-orange mb-2 sm:mb-3">
                  {dict?.about?.approach?.identify_title || "Identify"}
                </h2>
                <p className="text-gray-800 text-sm sm:text-base">
                  {dict?.about?.approach?.identify_text ||
                    "Identify leaders who are committed and passionate about the sustainable stewardship of land, agriculture, and the environment, and who can be trained and capacitated to provide expertise to public, and private sectors and communities."}
                </p>
              </div>

              {/* Bottom-left image */}
              <div className="h-48 sm:h-60 md:h-80">
                <Image
                  src="/images/team-members-2.jpg"
                  alt="GanzAfrica Office"
                  width={400}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Middle Column - Main Image + Establish */}
            <div>
              {/* Main center image */}
              <div className="h-48 sm:h-60 md:h-80">
                <Image
                  src="/images/team-members-1.jpg"
                  alt="GanzAfrica Team"
                  width={400}
                  height={320}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Establish section */}
              <div
                style={{ backgroundColor: "#F9F9FB" }}
                className="p-4 sm:p-6 h-auto sm:h-60 md:h-80"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-green-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <PersonIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-3">
                  {dict?.about?.approach?.establish_title || "Establish"}
                </h2>
                <p className="text-gray-800 text-sm sm:text-base">
                  {dict?.about?.approach?.establish_text ||
                    "Establish in-person digital training and incubation centres, enabling hands-on capacity enhancement programmes, professional development and networking designed to respond to specific challenges."}
                </p>
              </div>
            </div>

            {/* Right Column - Deploy + Image */}
            <div>
              {/* Deploy section */}
              <div
                style={{ backgroundColor: "#FFFDEB" }}
                className="p-4 sm:p-6 h-auto sm:h-60 md:h-80"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary-orange rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <PersonIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary-orange mb-2 sm:mb-3">
                  {dict?.about?.approach?.deploy_title || "Deploy"}
                </h2>
                <p className="text-gray-800 text-sm sm:text-base">
                  {dict?.about?.approach?.deploy_text ||
                    "Deploy trained young professionals to support the design and implementation of co-created, community-focused solutions for livelihood improvement."}
                </p>
              </div>

              {/* Bottom-right image */}
              <div className="h-48 sm:h-60 md:h-80">
                <Image
                  src="/images/team-group-photo.jpg"
                  alt="GanzAfrica Team Members"
                  width={400}
                  height={320}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="flex justify-center mb-6 sm:mb-10">
          <DecoratedHeading
            firstText={dict?.about?.promise?.heading_first || "Our"}
            secondText={dict?.about?.promise?.heading_second || "Promise"}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-4 max-w-6xl mx-auto">
          {/* Left side - Image */}
          <div className="w-full md:w-1/2 mb-4 md:mb-0">
            <div className="rounded-3xl overflow-hidden h-[300px] sm:h-[400px] md:h-[600px]">
              <Image
                src="/images/Subtract.png"
                alt="Two professionals shaking hands at Ministry of Environment event"
                width={600}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-1/2 flex flex-col space-y-4 sm:space-y-6">
            <PromiseCard
              type="partners"
              items={
                dict?.about?.promise?.partners_items || [
                  "Create a pipeline of highly motivated GanzAfrica fellows with land, climate, and agricultural training, leadership skills, and analytical capabilities.",
                  "Enhance cross-generational linkages to help foster blended solutions combining novel and traditional ideas.",
                ]
              }
            />

            <PromiseCard
              type="fellows"
              content={
                dict?.about?.promise?.fellows_items || [
                  "Provide up to 2 years of holistic training with a focus on data & analytics and leadership skills",
                  "Welcome fellows into a network of value-driven young Africans committed to leading Africa's transformation",
                  "Deliver work secondments with one of our partners to apply skills learned",
                ]
              }
              hasCurvedCorner={true}
            />
          </div>
        </div>
      </section>

      {/* Building Sustainable Solutions Section  */}
      <BuildingSolutionsSection
        dict={dict?.about}
        categories={categories}
        tags={tags}
      />
    </main>
  );
}
