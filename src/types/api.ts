export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
  members: GroupMember[];
  games: Game[];
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user: User;
}

export interface Game {
  id: string;
  name: string;
  groupId: string;
  playedAt: string;
  createdAt: string;
  scores: Score[];
}

export interface Score {
  id: string;
  gameId: string;
  userId: string;
  points: number;
  winner: boolean;
  user: User;
  game: Game;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  totalPoints: number;
  gamesWon: number;
  gamesPlayed: number;
}

export interface CreateUserRequest {
  email: string;
  name: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  creatorId: string;
}

export interface AddMemberRequest {
  userId: string;
}

export interface CreateGameRequest {
  name: string;
  groupId: string;
}

export interface CreateScoreRequest {
  gameId: string;
  userId: string;
  points: number;
  winner?: boolean;
}