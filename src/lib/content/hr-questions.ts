/**
 * The HR round, and what a good answer to each sounds like.
 *
 * These are model answers, not scripts. A student who recites one word for
 * word will be found out in the follow-up question, which is the one HR is
 * actually listening for — so the copy above them says to rewrite each in
 * their own words and keep only the shape.
 *
 * Anything that changes between one interview and the next is a {placeholder}
 * rather than a company name typed into the prose. The page swaps them for
 * whatever the student types, so the same answer can be aimed at Infosys on
 * Monday and somebody else on Thursday without hunting through paragraphs for
 * a name left behind — which is exactly how a rehearsed answer goes wrong.
 */

export type HrQuestion = {
  id: string;
  question: string;
  /** The same question, worn differently. HR rarely uses the first wording. */
  alsoAsked?: string[];
  /** When the question forks, which way this answer goes. */
  note?: string;
  answer: string;
};

/** The blanks, in the order a student should fill them. */
export const HR_FIELDS = [
  {
    key: "company",
    label: "Company",
    placeholder: "Infosys",
    hint: "The one you are interviewing with.",
  },
  {
    key: "industry",
    label: "Industry",
    placeholder: "AI",
    hint: "The field they work in, as they would describe it.",
  },
  {
    key: "recent",
    label: "Something they did recently",
    placeholder: "their collaboration with Transcell on stem-cell research",
    hint: "One specific thing, from their newsroom or a recent announcement. This is the line that proves you looked.",
  },
  {
    key: "tagline",
    label: "Their tagline or stated mission",
    placeholder: "Navigate your next",
    hint: "Usually on their careers page, in their own words.",
  },
  {
    key: "field",
    label: "Your field",
    placeholder: "AI and machine learning",
    hint: "What your background is actually in.",
  },
] as const;

export type HrFieldKey = (typeof HR_FIELDS)[number]["key"];

export const HR_QUESTIONS: HrQuestion[] = [
  {
    id: "why-us",
    question: "Why are you interested in this role and this company?",
    answer:
      "I'm excited about the opportunity to work with {company} because I admire your commitment to innovation in the {industry} industry. I'm particularly impressed by {recent}, which is a genuinely important direction. My background in {field} aligns closely with what this role asks for. I'm eager to grow in an organisation like {company}, whose “{tagline}” says something about where its priorities are — which is why I have chosen to pursue this opportunity with you.",
  },
  {
    id: "five-years",
    question: "Where do you want to see yourself in five years?",
    alsoAsked: [
      "What do you want from us?",
      "What are your long-term career goals?",
      "What motivates you?",
    ],
    answer:
      "I'm deeply passionate about innovation, because I believe it is a key driver of economic growth — it brings value to companies and, in the end, to whole societies. In five years I want to be someone who has made a significant contribution to meaningful innovation, using the knowledge and the technologies I picked up during my college years. I aim to get there either by developing my own ideas or by being an integral part of an organisation doing that work.",
  },
  {
    id: "aspirations",
    question: "What are your career aspirations?",
    answer:
      "My career aspirations are centred on entrepreneurs who contribute positively to society — people like Elon Musk, Ratan Tata and Jack Ma. Among them I'm particularly inspired by Elon Musk, because I think his work has had a profound impact on what people believe is possible. I aspire to contribute to ground-breaking advances and solutions that affect the world positively, drawing on that same visionary approach.",
  },
  {
    id: "challenge-personal",
    question:
      "Describe a challenging situation you faced, and how you handled it.",
    alsoAsked: [
      "How do you handle stress or pressure?",
      "Tell me about a time you had to hustle.",
    ],
    note: "They may ask for a professional example or a personal one. This is the personal answer.",
    answer:
      "When I started college I found it genuinely hard to balance my academic responsibilities against the need to build practical skills. At the same time I was working through a lot of personal uncertainty about life and about which career path to take. To deal with that, I read philosophy and psychology to get some clarity and some resilience, and in parallel I committed myself to learning machine learning and deep learning. It was a period of intense effort — I was developing the technical skill and the personal understanding at the same time — and it is what prepared me for what came after.",
  },
  {
    id: "challenge-professional",
    question: "Describe a time when you had to learn something new quickly.",
    note: "The professional answer to the same question.",
    answer:
      "My focus was originally on AI and analytics, because that was my specialisation. But I realised that as a computer science student I also needed web development if I wanted the placements ahead of me to go well. Recognising the urgency, I researched how to learn it efficiently and then went at it properly. I picked up the skills quickly and put them to work on a project called Expense Tracker, built with Django, HTML, CSS and JavaScript. It broadened what I can do, and it showed me I can adapt and pick up a new technology fast when I need to.",
  },
  {
    id: "outside-work",
    question: "What are you passionate about outside work?",
    alsoAsked: ["What are your hobbies?"],
    answer:
      "I read a fair amount and I listen to podcasts, which is how I keep learning outside of anything formal. I follow MMA, particularly the UFC. I also play cricket occasionally and watch films, which I enjoy.",
  },
  {
    id: "growth",
    question: "How do you define growth?",
    answer:
      "I think about growth in terms of compounding: consistent effort and consistent learning turn into significant progress over time, and very little of it looks dramatic on any single day. In the same way, I see real pressure as a catalyst rather than a problem — much the way pressure turns coal into a diamond. In the early part of my career I am committed to hard work and to taking on challenges directly, because I know those are the experiences that compound.",
  },
  {
    id: "strengths",
    question: "What are your strengths and weaknesses?",
    answer:
      "Professionally, my strengths are my skill set in computer science and engineering together with a genuinely hardworking nature — the combination is what lets me do good work and build a career on it. Personally, I have a clear sense of what work is, why it is worth doing and what I want out of life, which I consider a real strength to have this early.\n\nAs for weaknesses, I prefer to think of them as challenges rather than fixed shortcomings. One I do have is that my convictions about an idea can make me overly optimistic about it. I'm working on balancing that imagination against practical steps, so that what I set out to do is realistic and actually achievable.",
  },
  {
    id: "your-questions",
    question: "Do you have any questions for me?",
    note: "Never say no to this one. It is the cheapest way to look interested.",
    answer:
      "Based on the skills and the experience I've described, are there any additional skills or areas of expertise you would suggest I develop in order to do this job well?",
  },
];
