import * as React from "react"
import { classNames } from "../utils"
import { Spinner } from "./Spinner"

type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl"
type ButtonVariant = "filled" | "outlined" | "soft"
type ButtonRadius = ButtonSize | "none" | "full"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  leftSection?: React.ReactNode
  size?: ButtonSize
  radius?: ButtonRadius
  loading?: boolean
  fullWidth?: boolean
}

const buttonSize = (size: ButtonSize) => {
  // DEFAULT IS md

  switch (size) {
    case "xs":
      return "px-2 py-1 text-xs"
    case "sm":
      return "px-2 py-1 text-sm"
    case "lg":
      return "px-3 py-2 text-lg"
    case "xl":
      return "px-3.5 py-2.5 text-xl"
    default:
      return "px-2.5 py-1.5 text-md"
  }
}

const buttonVariant = (variant: ButtonVariant) => {
  switch (variant) {
    case "outlined":
      return "bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:ring-white/10"
    case "soft":
      return "bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-700/10 dark:text-gray-50 dark:hover:bg-indigo-700/20"
    default:
      return "bg-indigo-600 text-white hover:bg-indigo-500 disabled:dark:text-gray-400"
  }
}

const buttonRadius = (radius: ButtonRadius) => {
  switch (radius) {
    case "none":
      return "rounded-none"
    case "xs":
      return "rounded-sm"
    case "sm":
      return "rounded"
    case "lg":
      return "rounded-lg"
    case "xl":
      return "rounded-xl"
    case "full":
      return "rounded-full"
    default:
      return "rounded-md"
  }
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      type = "submit",
      children,
      leftSection,
      className,
      size = "md",
      variant = "filled",
      radius = "md",
      loading = false,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={classNames(
          className ?? "",
          "relative shadow-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:text-gray-50 disabled:bg-gray-400/70 dark:disabled:bg-gray-700/60",
          buttonSize(size),
          buttonVariant(variant),
          buttonRadius(radius),
          fullWidth ? "w-full" : "",
          loading
            ? "bg-gray-300 text-white dark:bg-gray-700 pointer-events-none"
            : ""
        )}
        {...props}
      >
        <div className="inline-flex space-x-4 items-center">
          {leftSection}
          <span>{children}</span>
        </div>
        {loading && (
          <div
            className={classNames(
              "absolute inset-0 flex justify-center items-center",
              loading ? "bg-gray-400/30 dark:bg-gray-400/30" : ""
            )}
          >
            <Spinner />
          </div>
        )}
      </button>
    )
  }
)

export { Button }
