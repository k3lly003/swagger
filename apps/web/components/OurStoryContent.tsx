import Image from "next/image";
import SectionWithScrollAnimation from "@/components/layout/SectionWithScroll";
import React from "react";
import {getDictionary} from "@/lib/get-dictionary";
import HeaderBelt from "@/components/layout/headerBelt";

type Props = {
    dict: Awaited<ReturnType<typeof getDictionary>>;
    isFrench: boolean;
};

export default function OurStoryContent({ dict, isFrench }: Props) {
    const contentClass = isFrench ? "flex-1 overflow-y-auto pr-2" : "flex-1";

    return (
        <div className="min-h-screen bg-white">
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
                    <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-2 leading-tight">
                        <span className="font-bold text-yellow-400">Empowering</span>{" "}
                        <span className="font-normal">Africa's Future</span>
                        <br />
                        <span className="font-normal">Through</span>{" "}
                        <span className="font-bold text-yellow-400">Transformative</span>
                    </h1>

                    <h2 className="text-yellow-400 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-wider mt-6">
                        OUR STORY
                    </h2>
                </div>
            </section>
            <HeaderBelt />

            <div className="pt-12 px-4 max-w-7xl mx-auto">
                {/* Section01 */}
                <SectionWithScrollAnimation
                    number="01"
                    title={
                        dict?.about?.origin_title || "Origin and Inspiration (Before 2022)"
                    }
                    text={
                        dict?.about?.origin_text ||
                        "Nearly three years ago, I established GanzAfrica with a clear mission: to build local human capital to champion the use of data and evidence to support public services and development agencies in decision-making, as they deliver essential programs to enhance people's standard of living, health, climate and environment, all critical food systems sectors. This initiative stemmed from many years of learning and experience gained working closely with public institutions and policy implementing partners. Over time, I noticed significant gaps in local capacity, efficiency and innovation potential, which resulted in slow progress and below-par developmental outcomes—especially within food systems sectors. Although GanzAfrica was officially founded in 2022, its roots go back much further. The ideas germinated from years of observing how well-meaning policies often fell short in implementation, primarily due to a lack of capacity. This has hampered progress across many African countries, where even good solutions have also been ineffective due to their application without contextual consideration."
                    }
                    imageUrl="/images/thiery.png"
                    imageAlt={dict?.about?.team_photo_alt || "GanzAfrica lessons"}
                    bgColor="bg-[#F9F9FB]"
                    accentColor="bg-primary-green"
                    textColor="text-primary-green"
                    imageFirst={false}
                    contentClass={contentClass}
                />

                {/* Section 2: The Vision and Approach - Yellow background */}
                <SectionWithScrollAnimation
                    number="02"
                    title={dict?.about?.vision_title || "The Vision and Approach"}
                    text={
                        dict?.about?.vision_text ||
                        "I realized that bridging these gaps would require a unique approach, one that involved equipping young, talented graduates with the tools to support impactful initiatives. These professionals would need to be embedded within very institutions that needed transformation. The GanzAfrica program embodies this vision. It identifies promising young professionals with the right attitudes and equips them with the skills to support mandated institutions, make evidence-based decisions, adopt systems thinking, and drive sustainable change. Fellows are strategically placed as change agents in partner public institutions, where they gain invaluable real-world experience while contributing fresh ideas. The interplay between personal skills, theoretical training and practical application is at the heart of what makes GanzAfrica unique and impactful."
                    }
                    imageUrl="/images/Image.png"
                    imageAlt={dict?.about?.team_photo_alt || "GanzAfrica team"}
                    bgColor="bg-[#FFFDEB]"
                    accentColor="bg-primary-orange"
                    textColor="text-primary-orange"
                    imageFirst={true}
                    contentClass={contentClass}
                />

                {/* Section 3 */}
                <SectionWithScrollAnimation
                    number="03"
                    title={
                        dict?.about?.progress_title || "Progress and Impact (2022-2024)"
                    }
                    text={
                        dict?.about?.progress_text ||
                        "In just over two years since our first cohort of fellows joined public institutions, we have witnessed tangible results. Not only have our fellows brought fresh perspectives and innovative approaches to their roles, but they also facilitated operational efficiencies that are supporting institutional decision-makers to yield better outcomes within these institutions. Their contributions range from analyzing data sets, providing policy insights, and fostering a culture of accountability. Importantly, their work is starting to have a lasting impact on how institutions in the broader East African food systems, ensuring they are more sustainable, inclusive, and responsive to the needs of the population. Yet all this could not be achieved without the collaborative efforts of dedicated partners in these institutions, whose support has played a crucial role in making GA a reality. Their commitment and belief in our mission have been instrumental in driving the success of GanzAfrica."
                    }
                    imageUrl="/images/nlteam.png"
                    imageAlt={dict?.about?.team_photo_alt || "GanzAfrica lessons"}
                    bgColor="bg-[#F9F9FB]"
                    accentColor="bg-primary-green"
                    textColor="text-primary-green"
                    imageFirst={false}
                    contentClass={contentClass}
                />

                {/* Section 4 */}
                <SectionWithScrollAnimation
                    number="04"
                    title={dict?.about?.success_title || "Fellow Success Stories"}
                    text={
                        dict?.about?.success_text ||
                        "We are equally proud of the individual journeys of our fellows. Many have leveraged their experience with GanzAfrica to secure meaningful and impactful roles within the public sector and beyond. Reinforcing our core belief in the power of investing in young professionals and equipping them with the skills to lead. At GanzAfrica, we see our fellows not just as participants in a program but as changemakers who will continue to drive transformation long after their time with us."
                    }
                    imageUrl="/images/team2.png"
                    imageAlt={dict?.about?.fellows_photo_alt || "GanzAfrica fellows"}
                    bgColor="bg-[#FFFDEB]"
                    accentColor="bg-primary-orange"
                    textColor="text-primary-orange"
                    imageFirst={true}
                    contentClass={contentClass}
                />

                {/* Section 5*/}
                <SectionWithScrollAnimation
                    number="05"
                    title={dict?.about?.lessons_title || "Lessons Learned and Adaptation"}
                    text={
                        dict?.about?.lessons_text ||
                        "As we reflect on our first two years of implementation, we remain steadfast in our commitment to continuous learning and adaptation. Each challenge and lesson shapes our strategy for the future. For instance, we have learned the importance of tailoring our training to address the specific needs of the institutions we partner with. We have also seen the value of fostering strong relationships with these organizations to ensure that the placement of fellows leads to long-term, systemic change rather than temporary solutions."
                    }
                    imageUrl="/images/tdteam.png"
                    imageAlt={dict?.about?.lessons_photo_alt || "GanzAfrica lessons"}
                    bgColor="bg-[#F9F9FB]"
                    accentColor="bg-primary-green"
                    textColor="text-primary-green"
                    imageFirst={false}
                    contentClass={contentClass}
                />

                {/* Section 6 */}
                <SectionWithScrollAnimation
                    number="06"
                    title={dict?.about?.future_title || "Future Vision and Expansion"}
                    text={
                        dict?.about?.future_text ||
                        "Looking ahead, we are excited about expanding the reach and impact of the GanzAfrica program. Our goal is to continue driving meaningful change, scale our operations, and build a growing network of technically skilled, innovative leaders who are passionate about transforming food systems and addressing other critical societal challenges. The journey has just begun, but we are already witnessing the positive impact of our work across the region. Together with our partners, fellows, and host institutions, we are committed to continued growth, shaping a sustainable future for Africa with innovation, efficiency, and excellence."
                    }
                    imageUrl="/images/minagriteam.png"
                    imageAlt={dict?.about?.team_members_alt || "GanzAfrica team members"}
                    bgColor="bg-[#FFFDEB]"
                    accentColor="bg-primary-orange"
                    textColor="text-primary-orange"
                    imageFirst={true}
                    contentClass={contentClass}
                />
            </div>
        </div>
    );
}