import { LinkedInProfileType, UGCPostsResponse } from '@/schemas/linkedin'

type Props = {
  profile: LinkedInProfileType
  posts: UGCPostsResponse
  likedPosts: UGCPostsResponse
}

const prompt = `
Objective:
Using the provided LinkedIn data (profile information, job history, posts, and liked posts), generate a detailed user profile that can help in matching them with potential co-founders or networking opportunities aligned with their goals and interests.

Instructions:
Please analyze the user's LinkedIn data and answer the following questions thoroughly. Your responses should be concise yet informative, focusing on insights that would be valuable for networking and co-founder matching.

Skills and Talents:

What skills or talents does the user have?
Highlight any endorsements, certifications, or notable achievements.
Ideal Role in a Startup:

In a room full of founders, what position would this person be best suited for if they were to start a company?
Consider their strengths, experience, and leadership qualities.
Reputation and Expertise:

What is the user known for?
Are there specific projects or contributions that stand out?
Desired Co-founder Qualities:

What kind of co-founder would they need to create a valuable startup?
Consider complementary skills, personalities, and values.
Preferred Company Type:

What kind of company would they like to work for?
Consider company size, culture, industry, and mission.
Interests and Hobbies:

What does the user like to do?
Include both professional and personal interests.
Passions:

What are they passionate about?
Look for recurring themes in their posts and engagements.
Career Intentions:

What is their main intent when it comes to their career?
Consider whether they are seeking growth, stability, innovation, etc.
Career Goals:

What are their short-term and long-term career goals?
Include any stated objectives or inferred aspirations.
Content Creation:

What kind of content do they post?
Identify topics, themes, and the nature of their posts (e.g., informative, motivational).
Content Engagement:

What kind of content do they like or react to?
This can reveal their interests and values.
Values:

What are their core values?
Look for values expressed directly or implied through their activities.
Role Models and Influencers:

Who are people they look up to?
This can include influencers they follow or individuals they frequently mention.
Social Media Activity Level:

How often do they spend time on social media?
Consider the frequency of their posts and engagements.
Industry Focus:

What industry does the user currently look for job opportunities in?
Include any industries of interest mentioned in their profile or activities.
Desired Content and Topics:

What are some topics or types of content that they would want to see more of?
This can help tailor networking opportunities to their interests.
Output Format:
Provide the information in a well-structured profile, using headings and bullet points where appropriate. Ensure that the profile reads cohesively and offers actionable insights for networking and co-founder matching.

Example Structure:

Overview
Skills and Talents
Ideal Role in a Startup
Reputation and Expertise
Desired Co-founder Qualities
Preferred Company Type
Interests and Passions
Career Intentions and Goals
Content Creation and Engagement
Core Values
Role Models and Influencers
Social Media Activity
Industry Focus
Desired Content and Topics
Additional Notes:

Use the user's own words where appropriate to preserve authenticity.
Ensure confidentiality and handle all data in compliance with privacy regulations.
Avoid making assumptions; base your analysis solely on the provided data.

`

export function processUserLinkedinData({ profile, posts, likedPosts }: Props) {
  console.log(profile, posts, likedPosts, prompt)
}
