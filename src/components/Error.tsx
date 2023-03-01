import { ValidationInfo } from "../types"

export const ValidationInfoDisplay = ({info}: {info: ValidationInfo | null}) => {
  if (!info) {return null}
  // We could also do styling based on what labels are on the error
  return <span>{info.reason}</span>
}