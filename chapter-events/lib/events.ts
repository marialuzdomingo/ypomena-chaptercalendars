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
};
