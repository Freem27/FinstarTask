export interface FinstarRowSource{
  [key: number]: string;
}

export interface NewFinstarRow {
  code: number;
  value: string;
}

export interface FinstarRow extends NewFinstarRow {
  rowNum: number;
}

export interface SetNewDataRequest {
  items: NewFinstarRow[];
  pageSize: number;
}