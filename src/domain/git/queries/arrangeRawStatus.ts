// import { GitStagingStatus } from './../../types';
// export function arrangeRawStatus(
//   status: GitStagingStatus
// ): { staged: string[]; modified: string[]; unmodified: string[] } {
//   const staged = raw
//     .filter(a => a.staged && a.status !== "unmodified")
//     .map(a => a.relpath)

//   const unmodified = raw
//     .filter(a => a.status === "unmodified")
//     .map(a => a.relpath)

//   const modified = raw.filter(a => !a.staged).map(a => a.relpath)
//   return { staged, modified, unmodified }
// }
