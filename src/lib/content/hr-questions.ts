/**
 * The HR round: what each question is really testing, and how to build an
 * answer to it.
 *
 * Deliberately not a set of model answers. An answer written by somebody else
 * is the one thing that cannot survive this round — HR asks a follow-up, and
 * a paragraph you did not live through has nothing behind it. So each entry
 * says what the question is for, the order a good answer goes in, a skeleton
 * with the specifics left blank, and the ways it usually goes wrong. The
 * student supplies everything that is actually about them.
 *
 * Anything that changes between one interview and the next is a {placeholder}
 * rather than a company name typed into the prose, so the same skeleton can
 * be aimed at a different employer without a name left behind in the middle
 * of a sentence — which is exactly how a rehearsed answer gets caught.
 */

export type HrQuestion = {
  id: string;
  question: string;
  /** The same question, worn differently. HR rarely uses the first wording. */
  alsoAsked?: string[];
  /** What they are actually listening for. */
  asking: string;
  /** The order a good answer goes in. */
  structure: string[];
  /** A frame to fill, not a script to learn. */
  skeleton: string;
  /** The ways this one usually goes wrong. */
  avoid: string[];
};

/** The blanks, in the order a student should fill them. */
export const HR_FIELDS = [
  {
    key: "company",
    label: "Company",
    placeholder: "the company you are interviewing with",
    hint: "Exactly as they write it themselves.",
  },
  {
    key: "role",
    label: "Role",
    placeholder: "the job title on the posting",
    hint: "The title as advertised, not your shorthand for it.",
  },
  {
    key: "industry",
    label: "Industry",
    placeholder: "the field they work in",
    hint: "How they describe their own field, in their words.",
  },
  {
    key: "recent",
    label: "Something they did recently",
    placeholder: "a product, a partnership, an announcement",
    hint: "One specific thing from their newsroom or careers page. This is the line that proves you looked them up.",
  },
  {
    key: "field",
    label: "Your field",
    placeholder: "what your background is in",
    hint: "The thing you can actually be questioned on for ten minutes.",
  },
] as const;

export type HrFieldKey = (typeof HR_FIELDS)[number]["key"];

export const HR_QUESTIONS: HrQuestion[] = [
  {
    id: "why-us",
    question: "Why are you interested in this role and this company?",
    alsoAsked: ["Why do you want to work here?", "Why us and not somebody else?"],
    asking:
      "Whether you have read anything about them at all. Almost everybody says the same three sentences about culture and growth, so the specific fact is the entire answer — it is the only part that could not have been written before you knew who you were meeting.",
    structure: [
      "One concrete thing about the company that you found yourself, and where you found it.",
      "Why that is interesting to you specifically — connect it to something you have done or studied.",
      "What the role itself asks for, and the part of your background that meets it.",
    ],
    skeleton:
      "I read about {recent}, and it caught my attention because {why it interests you — a project, a subject, something you have built}. I have been working on {field}, which is where {the overlap with what they do} comes in. The {role} posting asks for {a requirement from the posting}, and that is close to what I did on {your own project or coursework}.",
    avoid: [
      "Praise that fits any employer: “market leader”, “great culture”, “good learning opportunity”.",
      "Anything you cannot be questioned on — if you name a project of theirs, know what it does.",
      "Saying you want the job for the salary, the location or the brand, even if it is true.",
    ],
  },
  {
    id: "five-years",
    question: "Where do you want to see yourself in five years?",
    alsoAsked: [
      "What are your long-term career goals?",
      "What do you want from us?",
      "What motivates you?",
    ],
    asking:
      "Whether you have thought past the offer, and whether your plan and their job point the same way. They are also checking you are not treating this as a stopgap.",
    structure: [
      "The kind of work you want to be trusted with — depth in a craft, or leading it. Either is a fine answer.",
      "The step between here and there, in this job. This is the half most people leave out.",
      "One thing you want from them: mentoring, exposure to scale, ownership of a piece.",
    ],
    skeleton:
      "In five years I want to be {the kind of work — the person who owns X, or one of the stronger people in Y}. To get there the next two years matter most, and what I want out of them is {a concrete skill or kind of exposure}. That is part of why this role interests me — {the thing about this job that provides it}.",
    avoid: [
      "“In your chair” — it is a joke the interviewer has heard many times.",
      "A five-year plan with no first step, which reads as something you made up on the spot.",
      "Naming a goal that plainly needs a different employer or a different career.",
    ],
  },
  {
    id: "aspirations",
    question: "What are your career aspirations?",
    asking:
      "The same ground as the five-year question, but about direction rather than title. What kind of problem do you want to be near?",
    structure: [
      "The sort of problem that holds your attention, stated plainly.",
      "Evidence that it does — something you chose to do when nobody was marking it.",
      "How this role sits on that path.",
    ],
    skeleton:
      "What I keep coming back to is {the kind of problem}. I know that because {the unassigned thing you did — a side project, a paper you read, something you built for yourself}. A role in {field} at a company working on {industry} is a direct step along that, which is why I applied.",
    avoid: [
      "Naming a famous founder as your aspiration. It says nothing about you, and the follow-up — what specifically about how they work? — is hard to answer well.",
      "An aspiration with no evidence behind it. Anybody can claim to be passionate.",
    ],
  },
  {
    id: "challenge",
    question: "Describe a challenging situation you faced, and how you handled it.",
    alsoAsked: [
      "How do you handle stress or pressure?",
      "Tell me about a time something went wrong.",
    ],
    asking:
      "How you behave when things are not going well. The difficulty of the situation matters far less than whether you did something deliberate about it.",
    structure: [
      "The situation, in two sentences. Enough for them to picture it, no more.",
      "What made it genuinely hard — the constraint, not the feeling.",
      "What you actually did, step by step. This is most of the answer.",
      "How it turned out, including what you would do differently.",
    ],
    skeleton:
      "{The situation, in a sentence — what you were responsible for and when.} The hard part was {the real constraint: a deadline, a gap in your knowledge, someone unavailable}. I {the first thing you did}, then {the second}. In the end {the outcome, honestly}. If it came round again I would {the thing you learned}.",
    avoid: [
      "A challenge with no action in it — “it was stressful but I managed” is not an answer.",
      "Blaming a teammate, a lecturer or a manager. They are listening for how you talk about people who are not in the room.",
      "A story so small it suggests nothing has ever been difficult.",
    ],
  },
  {
    id: "learn-fast",
    question: "Describe a time when you had to learn something new quickly.",
    asking:
      "Whether you can be given something you do not already know. For a first job this matters more than what you currently know, because most of what you will use has not come up yet.",
    structure: [
      "What you needed to learn, and the deadline that made it urgent.",
      "How you went about it — the actual method, not “I researched it”.",
      "What you built or shipped with it, so the learning is provable.",
      "How long it took. Be honest; a realistic number is more convincing.",
    ],
    skeleton:
      "I needed {the skill or tool} because {the deadline or the thing that depended on it}. I {how you learned it — the docs, a specific course, reading an existing codebase, rebuilding something small}. Within {a real timeframe} I had {the thing you produced}, and {what it did or what worked}.",
    avoid: [
      "Naming a technology you cannot answer one follow-up question about.",
      "“I am a fast learner” with no example attached.",
      "Learning that never turned into anything — finish the story with an artefact.",
    ],
  },
  {
    id: "outside-work",
    question: "What are you passionate about outside work?",
    alsoAsked: ["What are your hobbies?", "Tell me something not on your CV."],
    asking:
      "Mostly whether you are a person they can sit next to. It is also a breather between harder questions — treat it as one.",
    structure: [
      "One or two real interests, said plainly.",
      "A detail that shows it is real rather than listed — what you are reading, where you play.",
      "Stop there. This answer should be short.",
    ],
    skeleton:
      "Outside work I {the interest}. {One specific, current detail — what you are in the middle of.} I also {a second, briefly}.",
    avoid: [
      "Inventing a hobby to sound well-rounded. The follow-up question exposes it immediately.",
      "Anything political or divisive, and anything that suggests it will cut into work.",
      "Listing five things. Two, with a detail, beats five without.",
    ],
  },
  {
    id: "growth",
    question: "How do you define growth?",
    asking:
      "Whether you have a considered view of your own development, or only want promotions. A specific definition is worth more than an inspiring one.",
    structure: [
      "Your definition, in one sentence.",
      "How you would know it was happening — the measure.",
      "One thing you are doing about it now.",
    ],
    skeleton:
      "I think of growth as {your definition — the range of problems you can be handed, the quality of your judgement, how little supervision the work needs}. I would know it was happening because {how you would measure it}. Right now that looks like {the thing you are actually doing}.",
    avoid: [
      "Borrowed metaphors — coal into diamonds, and similar. They sound rehearsed because they are.",
      "Defining growth purely as promotion or salary.",
      "A definition with no way to tell whether it is happening.",
    ],
  },
  {
    id: "strengths",
    question: "What are your strengths and weaknesses?",
    asking:
      "For the strength: whether you can be specific and back it up. For the weakness: whether you are honest, and whether you are doing anything about it. The weakness is the half they are actually listening to.",
    structure: [
      "One strength, relevant to this job, with a moment that demonstrates it.",
      "One real weakness — something that has actually cost you.",
      "The specific correction you are making, and how you know it is working.",
    ],
    skeleton:
      "My strength is {the strength, tied to the role}. Where that showed was {the specific moment}. As for a weakness, {the real one}. It cost me {what it cost — a deadline, a rewrite, a misunderstanding}. What I do about it now is {the concrete habit or check}, and {how you can tell it is working}.",
    avoid: [
      "A disguised boast: “I am a perfectionist”, “I work too hard”. Everyone recognises these.",
      "A weakness that would disqualify you for this specific job.",
      "Naming a weakness with no correction attached — that is the half that matters.",
    ],
  },
  {
    id: "your-questions",
    question: "Do you have any questions for me?",
    asking:
      "Whether you are choosing them too, or just hoping to be chosen. Saying no is the single cheapest way to look uninterested.",
    structure: [
      "Ask two. Have four ready, because some get answered during the interview.",
      "Make at least one about the work itself — what the first months actually look like.",
      "One about them is fine: what they like, what they find hard.",
    ],
    skeleton:
      "What does the first three months in the {role} usually look like — what would I be working on? · How does the team decide what to pick up next? · Given what I have described, what would you suggest I strengthen before starting? · What do you enjoy most about working at {company}?",
    avoid: [
      "“No, I think you covered everything.”",
      "Opening with salary, leave or working hours. Those belong to the offer conversation.",
      "Asking something the careers page answers, which shows you did not read it.",
    ],
  },
];
