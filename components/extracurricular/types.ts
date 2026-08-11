export interface Activity {
  uuid: string;
  title: string;
  period: string;
  target: string;
  applicationMethod: string;
  description: string;
  category: string;
  iconName?: string;
}

export interface ActivityReport {
  uuid: string;
  activityId: string;
  title: string;
  period: string;
  grade: string;
  major: string;
  author: string;
  wordsToJuniors: string;
  aiSummary: string;
  fileName: string;
  fileType: 'pdf' | 'docx' | 'hwpx' | string;
  fileUrl?: string;
  pages?: string[];
}
