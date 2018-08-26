import { StatusMatrix } from "../../types"

const FILE = 0
const HEAD = 1
const WORKDIR = 2
const STAGE = 3

export function getModifiedFilenames(matrix: StatusMatrix) {
  return matrix.filter(row => row[HEAD] !== row[WORKDIR]).map(row => row[FILE])
}

export function getUnstagedFilenames(matrix: StatusMatrix) {
  return matrix.filter(row => row[WORKDIR] !== row[STAGE]).map(row => row[FILE])
}

export function getDeletedFilenames(matrix: StatusMatrix) {
  return matrix.filter(row => row[WORKDIR] === 0).map(row => row[FILE])
}
