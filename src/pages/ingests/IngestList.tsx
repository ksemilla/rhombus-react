import { useQuery } from "@tanstack/react-query"
import { getIngestList } from "../../api/ingests"
import { Ingest } from "../../types/ingests"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { BadgeStatus } from "../../components/Badge"

function IngestInline(props: { ingest: Ingest; idx: number }) {
  const navigate = useNavigate()
  return (
    <tr
      className="cursor-pointer hover:bg-gray-100"
      onClick={() => navigate(`/ingests/${props.ingest.id}`)}
    >
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">
        {props.ingest.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-900">
        {props.ingest.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <BadgeStatus status={props.ingest.status} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500">
        {props.ingest.process_time.toFixed(2)} s
      </td>
    </tr>
  )
}

export function IngestList() {
  const location = useLocation()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const searchParams = new URLSearchParams(location.search)

  useEffect(() => {
    const paramValue = parseInt(searchParams.get("page") ?? "1")

    setPage(paramValue)
  }, [location.search])

  const setSearchParams = () => {
    navigate({ search: searchParams.toString() })
  }

  const handleNext = () => {
    searchParams.get("page")
      ? searchParams.set("page", (page + 1).toString())
      : searchParams.append("page", (page + 1).toString())

    setSearchParams()
  }

  const handlePrevious = () => {
    if (page === 2) {
      searchParams.delete("page")
      setSearchParams()
    } else if (page > 1) {
      searchParams.get("page")
        ? searchParams.set("page", (page - 1).toString())
        : searchParams.append("page", (page - 1).toString())
      setSearchParams()
    }
  }

  const { data } = useQuery({
    queryKey: ["ingests", "page", page],
    queryFn: async () => {
      return getIngestList({
        params: {
          page,
        },
      }).then((res) => res.data)
    },
  })

  return !data ? (
    <div>Loading...</div>
  ) : data.count === 0 ? (
    <div className="px-8 mt-4">
      <p className="text-xl text-gray-800">No ingests to show</p>
    </div>
  ) : (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="mt-4 text-base font-base leading-6 text-gray-900">
            A list of all the ingests
          </h1>
        </div>
      </div>
      <div className="mt-4 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                  >
                    ID
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Process Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.items.map((ingest, idx) => (
                  <IngestInline key={ingest.id} ingest={ingest} idx={idx} />
                ))}
              </tbody>
            </table>
            <nav
              className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
              aria-label="Pagination"
            >
              <div className="hidden sm:block">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{page * 20 - 19}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {data.count < page * 20 ? data.count : page * 20}
                  </span>{" "}
                  of <span className="font-medium">{data.count}</span> results
                </p>
              </div>
              <div className="flex flex-1 justify-between sm:justify-end">
                <button
                  className="relative inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  disabled={page < 2}
                  onClick={handlePrevious}
                >
                  Previous
                </button>
                <button
                  className="relative ml-3 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0"
                  disabled={data.count - (page + 1) * 20 <= 0}
                  onClick={handleNext}
                >
                  Next
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  )
}
