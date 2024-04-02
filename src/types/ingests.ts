export type Ingest = {
  id?: number
  name: string
  status: "uploading" | "processing" | "completed" | "failed"
  file?: File | null
  process_time: number
  row_nums: number
  processed_row_nums: number
}

export type IngestRecord = {
  id?: number
  data: any
}

export type IngestColumn = {
  id?: number
  label: string
  value: string
  dtype: string
  display_order: number
}
