export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  CREATE_POST: '/create',
  POST: '/post/:id',
  PROFILE: '/profile/:userId',
  BOOKMARKS: '/bookmarks',
  SEARCH: '/search',
  TRENDING: '/trending'
};

export const POST_TAGS = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "CSS",
  "HTML",
  "Vue",
  "Angular",
  "Database",
  "Firebase",
  "Next.js",
  "Tailwind",
  "APIs",
  "DSA",
  "System Design",
  "Open Source",
  "DevOps",
  "Security",
  "Testing",
  "Career",
  "Tutorial",
  "Question",
  "Discussion",
  "News",
  "General",
  "Community"
];

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

export const REPUTATION_ACTIONS = {
  CREATE_POST: 5,
  COMMENT: 2,
  RECEIVE_LIKE: 1,
  RECEIVE_UNLIKE: -1
};