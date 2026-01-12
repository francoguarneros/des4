
export enum ViewTab {
  BALANCE = 'BALANCE',
  OCUPACION = 'OCUPACIÓN',
  FISCAL = 'FISCAL'
}

export enum BottomTab {
  INICIO = 'INICIO',
  BUSCAR = 'BUSCAR',
  PERFIL = 'PERFIL'
}

export interface DayDetail {
  date: number;
  revenue: number;
  cost: number;
  occupancy: number;
}

export interface CFDI {
  id: string;
  date: string;
  amount: number;
  status: string;
}
