import { AxiosRequestConfig } from "axios"
import { Ingest, IngestColumn, IngestRecord } from "../types/ingests"
import { api } from "./api-service"

export const getIngestList = (config?: AxiosRequestConfig<any>) => {
  return api.get<{ items: Ingest[]; count: number }>("/api/ingests/", config)
}

export const getIngest = (id: number) => {
  return api.get<Ingest>(`/api/ingests/${id}/`)
}

export const getIngestRecords = (
  id: number,
  config?: AxiosRequestConfig<any>
) => {
  return api.get<{ items: IngestRecord[]; count: number }>(
    `/api/ingests/${id}/records/`,
    config
  )
}

export const getIngestColumns = (id: number) => {
  return api.get<IngestColumn[]>(`/api/ingests/${id}/columns/`)
}

export const updateIngestColumn = (
  ingestId: number,
  columnId: number,
  data: Partial<IngestColumn>
) => {
  return api.put<IngestColumn>(
    `/api/ingests/${ingestId}/columns/${columnId}/`,
    data
  )
}
