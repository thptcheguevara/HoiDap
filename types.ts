
export interface Attachment {
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
}

export interface Answer {
  id: string;
  author: string;
  content: string;
  attachment: Attachment | null;
  timestamp: string;
}

export interface Question {
  id: string;
  author: string;
  content: string;
  attachment: Attachment | null;
  timestamp: string;
  answers: Answer[];
}
