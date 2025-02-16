export interface NewsItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  image: string;
  content: string;
}

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const newsItems: NewsItem[] = [
  {
    id: "1",
    title: "Rwanda's Agricultural Revolution: Digital Land Management",
    description:
      "A groundbreaking digital platform is revolutionizing land management in Rwanda, empowering farmers and improving agricultural productivity through innovative technology.",
    date: "Mar 15, 2024",
    category: "News",
    image: "/images/news/team-members-1.jpg",
    content: `In a groundbreaking development for African agriculture, Rwanda has unveiled a revolutionary digital platform that is transforming the landscape of land management and agricultural productivity. This innovative system marks a significant milestone in the country's journey towards agricultural modernization and digital transformation.

The Digital Agricultural Land Management System (DALMS)

The newly launched platform, developed through a strategic partnership between the Rwanda Ministry of Agriculture and local tech innovators, represents a significant leap forward in agricultural technology. This system provides farmers, agricultural officers, and policymakers with real-time access to critical land and agricultural data.

Key Features and Capabilities:

1. Real-Time Land Monitoring
• Satellite-based land mapping and monitoring
• Automated crop health assessment
• Real-time weather integration
• Soil quality tracking and analysis

2. Digital Transaction Management
• Streamlined land registration process
• Transparent pricing information
• Digital payment integration
• Automated documentation system

3. Farmer Support Tools
• Mobile-friendly interface for remote access
• Voice-enabled features in local languages
• Offline functionality for areas with limited connectivity
• Interactive training modules

Impact and Early Results:

The implementation of this digital platform has already shown remarkable results:

• 40% reduction in land transaction processing time
• 35% increase in registered land transactions
• 25% improvement in crop yield planning accuracy
• 50% increase in farmer participation in digital agricultural services

Farmer Success Stories:

Jean Mugisha, a farmer from the Eastern Province, shares his experience: "The new digital system has transformed how I manage my farm. I can now access real-time weather updates, soil data, and market prices all from my phone. This has helped me make better decisions about when to plant and what crops to grow."

Future Developments:

The platform's roadmap includes several exciting features planned for implementation:

1. Advanced Analytics
• AI-powered crop yield prediction
• Automated pest and disease detection
• Climate change impact assessment
• Market trend analysis

2. Enhanced Connectivity
• Integration with other agricultural services
• Cross-border data sharing capabilities
• Enhanced mobile app features
• IoT sensor integration

3. Community Features
• Farmer-to-farmer knowledge sharing
• Digital marketplace integration
• Community support forums
• Expert consultation services

Capacity Building and Training:

To ensure widespread adoption, the initiative includes:

• Regular training workshops in all districts
• Mobile training units for remote areas
• Online learning resources
• Peer-to-peer support networks

The Way Forward:

This digital revolution in Rwanda's agricultural sector sets a precedent for other African nations. The success of this platform demonstrates how technology can bridge the gap between traditional farming practices and modern agricultural management.

Recommendations for Farmers:

1. Getting Started
• Register for the platform through local agricultural offices
• Attend training sessions in your district
• Download the mobile application
• Update your land registration information

2. Best Practices
• Regularly update your farm data
• Utilize the weather forecasting features
• Participate in online training modules
• Engage with the farmer community

Conclusion:

Rwanda's digital land management platform represents more than just technological advancement; it's a comprehensive solution that empowers farmers, streamlines agricultural processes, and paves the way for sustainable agricultural development. As the system continues to evolve and improve, it stands as a model for agricultural modernization across Africa.`,
  },
  {
    id: "2",
    title: "Sustainable Farming Practices Transform East African Agriculture",
    description:
      "Innovative sustainable farming methods are revolutionizing agriculture across East Africa, improving yields while protecting the environment.",
    date: "Mar 10, 2024",
    category: "Blogs",
    image: "/images/news/maize.avif",
    content: `The landscape of East African agriculture is undergoing a remarkable transformation as farmers embrace sustainable farming practices that promise both improved yields and environmental conservation. This shift represents a crucial step toward food security and ecological sustainability in the region.

Traditional farming methods are being enhanced with modern sustainable practices, creating a hybrid approach that respects local knowledge while incorporating scientific innovations. Farmers across the region are reporting significant improvements in both crop yields and soil health.

Key sustainable practices being adopted include:
• Integrated pest management systems
• Water-efficient irrigation techniques
• Crop rotation and intercropping
• Organic fertilizer production and application
• Agroforestry integration

Success stories from various communities highlight the positive impact of these sustainable practices. For example, in central Kenya, farmers implementing these methods have seen up to 40% increase in crop yields while reducing water usage by 30%.

The adoption of these practices has also led to improved soil fertility, reduced erosion, and increased biodiversity in farming areas. This holistic approach to agriculture is proving that productivity and environmental conservation can go hand in hand.

Looking ahead, the success of these sustainable farming initiatives provides a blueprint for agricultural development across Africa. As more farmers adopt these practices, we're seeing a positive shift toward more resilient and sustainable food systems.`,
  },
  {
    id: "3",
    title: "Impact Assessment: Youth in Agriculture Programs 2023",
    description:
      "Comprehensive analysis reveals significant success in youth engagement programs across African agriculture sector.",
    date: "Mar 5, 2024",
    category: "Reports",
    image: "/images/news/team-members-2.jpg",
    content: `A comprehensive assessment of youth engagement in agriculture programs across Africa has revealed promising results in attracting and retaining young people in the agricultural sector. The study, conducted throughout 2023, provides valuable insights into successful strategies and areas for improvement.

Key Findings:

1. Program Participation and Retention
• 65% increase in youth participation in agricultural programs
• 78% retention rate in youth-led agricultural initiatives
• 40% of participants started their own agribusiness ventures

2. Economic Impact
• Average income increase of 45% for program participants
• Creation of over 1,000 new agricultural jobs
• Establishment of 150 youth-led agricultural enterprises

3. Innovation and Technology Adoption
• 80% of participants integrated digital tools in farming
• 60% implemented modern farming techniques
• 35% developed new agricultural technology solutions

Recommendations:

The assessment highlights several key recommendations for strengthening youth engagement in agriculture:
• Increased access to agricultural finance and credit facilities
• Enhanced digital skills training programs
• Stronger mentorship and support networks
• Integration of modern technology in traditional farming practices

The success of these programs demonstrates the vital role of youth in transforming African agriculture. Continued investment in youth-focused agricultural initiatives is essential for the sector's future growth and sustainability.`,
  },
  {
    id: "4",
    title: "Climate-Smart Agriculture: Research Findings 2024",
    description:
      "New research reveals breakthrough strategies in climate-resilient farming methods for African agriculture.",
    date: "Feb 28, 2024",
    category: "Publications",
    image: "/images/news/team-members-1.jpg",
    content: `Recent research conducted across multiple African regions has unveiled groundbreaking insights into climate-smart agricultural practices. This comprehensive study, completed in early 2024, provides crucial data on adapting farming methods to climate change while maintaining productivity.

Research Methodology:
The study employed a mixed-methods approach, combining field experiments, farmer surveys, and climate data analysis across 12 different ecological zones in Africa. Over 1,000 farmers participated in the research, implementing various climate-smart agricultural techniques.

Key Findings:

1. Crop Resilience
• Identification of drought-resistant crop varieties with 30% higher survival rates
• Development of new intercropping patterns increasing yield stability
• Successful implementation of water-efficient farming techniques

2. Soil Management
• Novel approaches to soil conservation reducing erosion by 40%
• Organic matter management techniques improving soil fertility
• Integration of traditional and modern soil enhancement methods

3. Water Management
• Innovative irrigation systems reducing water usage by 35%
• Rainwater harvesting techniques increasing water availability
• Soil moisture conservation methods extending growing seasons

Practical Applications:
The research findings have led to the development of practical guidelines for farmers, including:
• Seasonal planting calendars adjusted for climate change
• Soil management protocols for different agricultural zones
• Water conservation strategies for various crop types

This research represents a significant step forward in developing climate-resilient agricultural practices for African farmers. The findings provide a foundation for future agricultural policies and farming practices across the continent.`,
  },
];

export const getNewsBySlug = (slug: string): NewsItem | undefined => {
  return newsItems.find((item) => generateSlug(item.title) === slug);
};
