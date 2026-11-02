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
  memo?: string;
  fileName: string;
  fileType: string;
  fileKey?: string;
  fileUrl?: string;
}
