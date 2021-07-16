export type Genre = 'tragedy' | 'comedy';

export type PlayID = 'hamlet' | 'as-like' | 'othello';

export type Play = {
  name: string;
  type: Genre;
};

// Statement > statement()를 보면 plays[perf.playID] 사용하는 곳이 있음
export type Plays = {
  [playID in PlayID]: Play;
};

export interface Performance {
  playID: PlayID;
  audience: number;
}

export interface Invoice {
  customer: string;
  performances: Performance[];
}
