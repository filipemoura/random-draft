
export enum Role {
  REGULAR = 'Regular',
  CAPTAIN = 'Capitão',
  GOALKEEPER = 'Goleiro',
  CHILD = 'Criança',
}

export interface Player {
  id: string;
  name: string;
  role: Role;
}
