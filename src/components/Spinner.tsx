import { classNames } from "../utils"

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl"

export function Spinner(props: { size?: SpinnerSize }) {
  let _size = "h-20 w-20"

  switch (props.size) {
    case "xs":
      _size = "h-5 w-5 border-8"
      break
    default:
      _size = "h-5 w-5 border-2"
      break
  }

  return (
    <div
      className={classNames(
        "border-gray-300 animate-spin rounded-full border-t-blue-600",
        _size
      )}
    />
  )
}
