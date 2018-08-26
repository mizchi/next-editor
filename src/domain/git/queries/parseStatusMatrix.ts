import { StatusMatrix } from "../../types"

// See detail https://isomorphic-git.org/docs/en/statusMatrix

const FILE = 0
const HEAD = 1
const WORKDIR = 2
const STAGE = 3

// The HEAD status is either absent (0) or present (1).
const HEAD_ABSENT = 0
const HEAD_PRESENT = 1

// The WORKDIR status is either absent (0), identical to HEAD (1), or different from HEAD (2).
const WORKDIR_ABSENT = 0
const WORKDIR_IDENTICAL = 1
const WORKDIR_DIFFERENT = 2

// The STAGE status is either absent (0), identical to HEAD (1), identical to WORKDIR (2), or different from WORKDIR (3).
const STAGE_ABSENT = 0
const STAGE_IDENTICAL_TO_HEAD = 1
const STAGE_IDENTICAL_TO_WORKDIR = 2
const STAGE_DIFFERENT_TO_WORKDIR = 3

export function getModifiedFilenames(matrix: StatusMatrix) {
  return matrix.filter(row => row[HEAD] !== row[WORKDIR]).map(row => row[FILE])
}

export function getUnstagedFilenames(matrix: StatusMatrix) {
  return matrix.filter(row => row[WORKDIR] !== row[STAGE]).map(row => row[FILE])
}

export function getStagedFilenames(matrix: StatusMatrix) {
  return matrix
    .filter(row => row[STAGE] >= STAGE_IDENTICAL_TO_WORKDIR)
    .map(row => row[FILE])
}

export function getRemovableFilenames(matrix: StatusMatrix) {
  return matrix
    .filter(row => row[WORKDIR] === HEAD_ABSENT && row[STAGE] !== STAGE_ABSENT)
    .map(row => row[FILE])
}

export function getRemovedFilenames(matrix: StatusMatrix) {
  console.log(matrix)
  return matrix
    .filter(row => row[WORKDIR] === HEAD_ABSENT && row[STAGE] === STAGE_ABSENT)
    .map(row => row[FILE])
}
