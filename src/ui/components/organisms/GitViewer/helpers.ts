import invertBy from "lodash/invertBy"
import { GitStagingStatus, GitStatusString } from "./../../../../domain/types"

export const STAGED_KEYS: GitStatusString[] = ["modified", "deleted", "added"]
export const MODIFIED_KEYS: GitStatusString[] = [
  "*modified",
  "*deleted",
  "*absent"
]
export const UNTRAKED_KEYS: GitStatusString[] = ["*added"]

export function buildGroupedGitStatus(staging: GitStagingStatus) {
  const inv: { [s in GitStatusString]: string[] | null } = invertBy(
    staging
  ) as any
  const hasStaged: boolean = STAGED_KEYS.some(key => !!(inv as any)[key])
  const hasModified: boolean = MODIFIED_KEYS.some(key => !!(inv as any)[key])
  const hasUntracked: boolean = UNTRAKED_KEYS.some(key => !!(inv as any)[key])
  const hasError: boolean = !!inv.__error__
  const hasChanges = hasStaged || hasModified
  return {
    grouped: inv,
    hasStaged,
    hasModified,
    hasUntracked,
    hasError,
    hasChanges
  }
}
