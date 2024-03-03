export interface IPaginationArgs {
  Offset: number
  Limit: number
}

export interface IGetUnitObjectives extends IPaginationArgs {
  planID: number
  unitID: string
  period?: Date
}
