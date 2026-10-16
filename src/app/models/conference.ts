export interface Conference {
  id: number;
  title: string;
  description: string;
  category: string;
  place: string;
  date: string;
  maxParticipants: number;
  nbParticipants: number;
  speaker?: string;
}
