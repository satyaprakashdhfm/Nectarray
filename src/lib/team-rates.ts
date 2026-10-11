/**
 * What people cost to hire in India, as monthly CTC (salary before tax and
 * deductions, not take-home). Averages from salary sites, checked
 * 11 Oct 2026. The sites disagree, so each role keeps the 25th to 75th
 * percentile range next to its average. The estimate shows them as a guide
 * and leaves each person's figure blank to be filled in.
 */
export type TeamRole = {
  id: string;
  role: string;
  /** The figure the estimate starts from, ₹ a month. */
  monthly: number;
  low: number;
  high: number;
  basis: string;
  source: { label: string; url: string };
};

export const TEAM_RATES_CHECKED = "11 Oct 2026";

export const TEAM_ROLES: TeamRole[] = [
  {
    id: "developer",
    role: "Full-stack developer",
    monthly: 54_200,
    low: 34_500,
    high: 91_700,
    basis:
      "Glassdoor average ₹6.5 lakh a year from 10,133 salaries (Aug 2026).",
    source: {
      label: "Glassdoor",
      url: "https://www.glassdoor.co.in/Salaries/full-stack-developer-salary-SRCH_KO0,20_P2.htm",
    },
  },
  {
    id: "designer",
    role: "UI/UX designer",
    monthly: 44_600,
    low: 28_200,
    high: 69_800,
    basis: "Glassdoor median ₹5.35 lakh a year from 3,222 salaries (Sep 2026).",
    source: {
      label: "Glassdoor",
      url: "https://www.glassdoor.com/Salaries/india-ui-ux-designer-salary-SRCH_IL.0,5_IN115_KO6,20.htm",
    },
  },
  {
    id: "ai-engineer",
    role: "AI engineer",
    monthly: 83_300,
    low: 50_000,
    high: 1_25_000,
    basis:
      "About ₹10 lakh a year on average (Glassdoor, May 2026, as quoted by salary guides); product companies pay far more.",
    source: {
      label: "IIT Kharagpur guide",
      url: "https://online.iitkgp.ac.in/blog/ai-ml-engineer-salary-india",
    },
  },
  {
    id: "marketing",
    role: "Digital marketing executive",
    monthly: 32_500,
    low: 20_800,
    high: 53_300,
    basis:
      "Hyring's 2026 median ₹3.9 lakh a year. Glassdoor puts a digital marketing specialist at ₹4.9 lakh.",
    source: {
      label: "Hyring",
      url: "https://hyring.com/jobseeker-toolkit/salary/digital-marketing-executive-salary-in-india",
    },
  },
  {
    id: "content",
    role: "Content creator",
    monthly: 27_000,
    low: 18_100,
    high: 45_000,
    basis:
      "Glassdoor base ₹3.24 lakh a year. Indeed shows ₹18,076 a month (Jul 2026); Hyring's 2026 median is ₹5.4 lakh a year.",
    source: {
      label: "Indeed",
      url: "https://in.indeed.com/salaries/content-writer-Salaries",
    },
  },
];
