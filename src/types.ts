export interface Meme {
  id: number;
  name: string;
  chain: string;
  submissionCount: number;
  likes: number;
  firstSubmitter?: string;
  shillersPickCount?: number;
  popularityHistory?: number[];
  submissionDate: string;
}

export interface User {
  id: number;
  name: string;
  streak: number;
  totalSubmissions: number;
  likedMemes: number[];
  submittedMemes: string[];
  shillersPicks: string[];
  followers: number[];
  following: number[];
}