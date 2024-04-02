import { Disclosure } from "@headlessui/react"
import { classNames } from "../utils"
import { Link, useLocation } from "react-router-dom"

export function Nav() {
  const path = useLocation().pathname
  return (
    <Disclosure as="nav" className="bg-white shadow">
      {() => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-2">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    to="/"
                    className={classNames(
                      "inline-flex items-center border-b-2 px-1 pt-1 font-medium text-gray-900",
                      path === "/" ||
                        path === "/ingests" ||
                        path === "/ingests/"
                        ? "border-indigo-500"
                        : ""
                    )}
                  >
                    List
                  </Link>
                  <Link
                    to="/ingests/create"
                    className={classNames(
                      "inline-flex items-center border-b-2 px-1 pt-1 font-medium text-gray-900",
                      path.includes("create") ? "border-indigo-500" : ""
                    )}
                  >
                    Create
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}
