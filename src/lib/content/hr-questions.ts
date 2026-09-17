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
  /**
   * "guide" where the entry says how to build an answer rather than being
   * one. Some questions are only answerable out of your own history — the
   * challenge you faced, what you taught yourself, what you do at the
   * weekend — and a model answer for those would be somebody else's life
   * for a student to recite, which is the one thing that does not survive a
   * follow-up question.
   */
  mode?: "guide";
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
    note: "They may ask for a professional example or a personal one. Either works — pick the one you can say most about.",
    mode: "guide",
    answer:
      "Pick one real situation and tell it in four beats: what you were responsible for, what actually made it hard — the constraint, not the feeling — the two or three things you did about it, and how it turned out, including what you would do differently. Keep the setup to two sentences; most of the answer should be what you did, because that is the only part they are assessing. Do not blame a teammate or a lecturer, and do not reach for something so small that it suggests nothing has ever been difficult.",
  },
  {
    id: "challenge-professional",
    question: "Describe a time when you had to learn something new quickly.",
    mode: "guide",
    answer:
      "Name the thing you had to learn and the deadline that made it urgent, then say how you actually learned it — the docs, a specific course, reading an existing codebase — rather than \"I researched it\". Finish with what you built using it and roughly how long it took; a realistic number is more convincing than a heroic one. The point of the story is the artefact at the end, so do not name a technology you cannot answer a single follow-up question about.",
  },
  {
    id: "outside-work",
    question: "What are you passionate about outside work?",
    alsoAsked: ["What are your hobbies?"],
    mode: "guide",
    answer:
      "Name one or two real interests and give one current detail for each — what you are reading now, where you play — because the detail is what makes it sound true. Then stop: this is a breather between harder questions, not an opportunity. Two interests with a detail beat five without, inventing one to sound well-rounded falls apart at the first follow-up, and anything divisive or anything that sounds like it will cut into work is best left out.",
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
    answer:
      "Based on the skills and the experience I've described, are there any additional skills or areas of expertise you would suggest I develop in order to do this job well?",
  },
];
