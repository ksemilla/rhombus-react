import { useMutation, useQuery } from "@tanstack/react-query"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  getIngest,
  getIngestColumns,
  getIngestRecords,
  updateIngestColumn,
} from "../../api/ingests"
import { Ingest, IngestColumn, IngestRecord } from "../../types/ingests"
import { useEffect, useState } from "react"
import { BadgeStatus } from "../../components/Badge"

function RenderHeaders(props: { columns: IngestColumn[]; ingest: Ingest }) {
  const mutate = useMutation({
    mutationFn: async (args: {
      ingestId: number
      columnId: number
      data: Partial<IngestColumn>
    }) => {
      return updateIngestColumn(args.ingestId, args.columnId, args.data).then(
        (res) => res.data
      )
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: (error) => {
      console.log(error)
    },
  })

  return (
    <thead>
      <tr>
        {props.columns.map((column) => (
          <th
            key={column.id}
            scope="col"
            className="py-3.5 pl-4 pr-3 min-w-36 text-left font-semibold text-gray-900"
          >
            <p>{column.label}</p>
            <select
              defaultValue={column.dtype}
              className="w-full p-0 border-none text-xs"
              onChange={(e) => {
                mutate.mutate({
                  ingestId: props.ingest.id ?? 0,
                  columnId: column.id ?? 0,
                  data: {
                    dtype: e.target.value,
                  },
                })
              }}
            >
              <option value="object">Text</option>
              <option value="int8">Int8</option>
              <option value="int16">Int16</option>
              <option value="int32">Int32</option>
              <option value="int64">Int64</option>
              <option value="float32">Float32</option>
              <option value="flost64">Float64</option>
              <option value="bool">Boolean</option>
              <option value="datetime64[ns]">Date Time</option>
              <option value="category">Category</option>
              <option value="complex">Complex</option>
            </select>
          </th>
        ))}
        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
          <span className="sr-only">Edit</span>
        </th>
      </tr>
    </thead>
  )
}

function renderBody(
  records: { items: IngestRecord[]; count: number },
  columns: IngestColumn[]
) {
  console.log(records)
  return (
    <tbody className="divide-y divide-gray-200">
      {records.items.map((record) => (
        <tr key={record.id}>
          {columns.map((column) => (
            <td
              key={column.id}
              className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900"
            >
              {column.dtype === "bool"
                ? record.data[column.value]
                  ? "true"
                  : "false"
                : record.data[column.value]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  )
}

export function IngestDetail() {
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

  const { id } = useParams()

  const { data: ingest } = useQuery({
    queryKey: ["ingests", id],
    queryFn: async () => {
      return getIngest(parseInt(id ?? "")).then((res) => res.data)
    },
  })

  const { data: ingestColumns } = useQuery({
    queryKey: ["ingests", id, "columns"],
    queryFn: async () => {
      return getIngestColumns(parseInt(id ?? "")).then((res) => res.data)
    },
  })

  const { data: ingestRecords } = useQuery({
    queryKey: ["ingests", id, "records", "page", page],
    queryFn: async () => {
      return getIngestRecords(parseInt(id ?? ""), { params: { page } }).then(
        (res) => res.data
      )
    },
  })

  return !ingest || !ingestRecords ? (
    <div>Loading...</div>
  ) : (
    <div className="mt-4 px-8">
      <div className="">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex space-x-4">
              <h1 className="text-base font-semibold leading-6 text-gray-900">
                {ingest.name}
              </h1>
              <BadgeStatus status={ingest.status} />
            </div>
            <p className="mt-2">
              Processed rows: {ingest.processed_row_nums}/{ingest.row_nums}
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                {ingestColumns && (
                  <RenderHeaders columns={ingestColumns} ingest={ingest} />
                )}
                {ingestRecords &&
                  ingestColumns &&
                  renderBody(ingestRecords, ingestColumns)}
              </table>
            </div>
          </div>
        </div>
        <nav
          className="w-full mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
          aria-label="Pagination"
        >
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{page * 20 - 19}</span> to{" "}
              <span className="font-medium">
                {ingestRecords.count < page * 20
                  ? ingestRecords.count
                  : page * 20}
              </span>{" "}
              of <span className="font-medium">{ingestRecords.count}</span>{" "}
              results
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
              disabled={ingestRecords.count - (page + 1) * 20 <= 0}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
