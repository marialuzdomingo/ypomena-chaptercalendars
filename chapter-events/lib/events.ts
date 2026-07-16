export type ChapterEvent = {
  id: string;
  chapterName: string;
  name: string;
  date: string | null; // ISO date string (yyyy-mm-dd), or null if missing/unparseable
  status: string | null;
  eventType: string | null;
  location: string | null;
  description: string | null;
  link: string | null;
  openToRegion: string | null; // "COR / Open to Region"
  lifelongLearningCategories: string | null;
  topicCategory: string | null;
  resource: string | null; // "Speaker / Resource"
  resourceStatus: string | null;
};
