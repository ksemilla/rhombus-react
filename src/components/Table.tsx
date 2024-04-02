import { createContext, useContext } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { camelCaseToWords, classNames } from "../utils"
import { PER_PAGE_SIZE } from "../const"
import { Button } from "./Button"
// import { PER_PAGE_SIZE } from "../../const/utils"

const TableContext = createContext<{ value: any } | undefined>(undefined)
const useTableContext = () => useContext(TableContext)

function TableContextProvider(props: {
  children: React.ReactNode
  value: any
}) {
  return (
    <TableContext.Provider value={props.value}>
      {props.children}
    </TableContext.Provider>
  )
}

type TableProps = {
  items: any[]
  children: React.ReactElement[]
  onRowClick?: (obj: any) => void
  pagination?: React.ReactNode
}

export function Table(props: TableProps) {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  {props.children.map((node, idx) => (
                    <th
                      key={idx}
                      className={classNames(
                        "px-3 py-3.5 text-left text-sm font-semibold text-gray-800 dark:text-white",
                        idx === 0 ? "pl-4 pr-3 text-left sm:pl-0" : ""
                      )}
                    >
                      {camelCaseToWords(node.props.name).toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {props.items.map((item, idx) => {
                  return (
                    <tr
                      key={idx}
                      onClick={() => props.onRowClick?.(item)}
                      className={classNames(
                        !!props.onRowClick
                          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900/50"
                          : ""
                      )}
                    >
                      <TableContextProvider value={item}>
                        {props.children?.map((node, jdx) => {
                          return (
                            <td
                              key={jdx}
                              className={classNames(
                                "whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300",
                                jdx === 0 ? "pl-4 pr-3 font-medium sm:pl-0" : ""
                              )}
                            >
                              {node}
                            </td>
                          )
                        })}
                      </TableContextProvider>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {props.pagination}
          </div>
        </div>
      </div>
    </div>
  )
}

type TableFieldProps = {
  name: string
  render?: (obj: any) => React.ReactNode
}

Table.Field = (props: TableFieldProps) => {
  const obj = useTableContext() as Record<string, any>

  const value = obj?.[props.name]
  return <div>{props.render ? props.render(value) : value}</div>
}

type TablePaginationProps = {
  count: number
}

Table.Pagination = (props: TablePaginationProps) => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const page = parseInt(queryParams.get("page") ?? "1")
  // const perPage = parseInt(
  //   queryParams.get("perPage") ?? PER_PAGE_SIZE.toString()
  // )
  const navigate = useNavigate()

  const setSearchParams = () => {
    navigate({ search: queryParams.toString() })
  }

  const handleNext = () => {
    queryParams.get("page")
      ? queryParams.set("page", (page + 1).toString())
      : queryParams.append("page", (page + 1).toString())

    setSearchParams()
  }

  const handlePrevious = () => {
    if (page === 2) {
      queryParams.delete("page")
      setSearchParams()
    } else if (page > 1) {
      queryParams.get("page")
        ? queryParams.set("page", (page - 1).toString())
        : queryParams.append("page", (page - 1).toString())
      setSearchParams()
    }
  }
  return (
    <nav
      className="flex items-center justify-between border-t border-gray-200 py-3 "
      aria-label="Pagination"
    >
      <div className="hidden sm:block">
        <p className="text-sm ">
          Showing{" "}
          <span className="font-medium">
            {page * PER_PAGE_SIZE - (PER_PAGE_SIZE - 1)}
          </span>{" "}
          to{" "}
          <span className="font-medium">
            {page * PER_PAGE_SIZE > props.count
              ? props.count
              : page * PER_PAGE_SIZE}
          </span>{" "}
          of <span className="font-medium">{props.count}</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end space-x-4">
        <Button onClick={handlePrevious} color="gray" disabled={page <= 1}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          color="gray"
          disabled={page * PER_PAGE_SIZE - props.count >= 0}
        >
          Next
        </Button>
      </div>
    </nav>
  )
}
