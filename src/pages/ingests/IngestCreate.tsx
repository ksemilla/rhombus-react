import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Button } from "../../components/Button"
import { ArrowUpOnSquareIcon, DocumentIcon } from "@heroicons/react/24/outline"
import { classNames } from "../../utils"
import { CHUNK_SIZE } from "../../const"

export function IngestCreate() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [fileName, setFileName] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
      setUploadProgress(0)
    }
  }

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Trigger click event on file input
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitted(true)
    setUploadProgress(0)
    if (selectedFile) {
      handleUpload()
    }
  }

  const handleUpload = async () => {
    let ingestId = ""
    if (selectedFile) {
      const fileSize = selectedFile.size
      let offset = 0

      while (offset < fileSize) {
        console.log("Start")
        const chunk = selectedFile.slice(offset, offset + CHUNK_SIZE)
        const formData = new FormData()
        formData.append("file", chunk)
        formData.append(
          "finalChunk",
          offset + CHUNK_SIZE >= fileSize ? "true" : "false"
        )
        formData.append("name", fileName)
        formData.append("file_name", selectedFile.name)
        if (ingestId) {
          formData.append("ingest_id", ingestId)
        }

        try {
          const response = await axios.post(
            "http://localhost:8000/api/ingests/upload/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const tprogress = Math.round(
                  (offset + progressEvent.loaded / fileSize) * 100
                )
                const progress = tprogress > 100 ? 100 : tprogress
                setUploadProgress(progress)
              },
            }
          )

          ingestId = response.data.ingest_id
          offset += CHUNK_SIZE
          console.log(response.data)
          if (response.data.status === "processing") {
            navigate(`/ingests/${response.data.ingest_id}`)
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data.message)
          } else {
            setErrorMessage("Something went wrong")
          }
          break
        }
      }
    }
  }

  return (
    <div className="max-w-lg m-auto mt-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <button
          type="button"
          className={classNames(
            "w-full group py-12 space-y-4 cursor-pointer flex flex-col justify-center items-center",
            isSubmitted && !selectedFile ? "border-red-400" : "",
            selectedFile
              ? "border-indigo-400"
              : "border-4 border-dashed hover:border-indigo-500"
          )}
          onClick={handleClick}
        >
          {selectedFile ? (
            <DocumentIcon className="h-32 w-32 text-indigo-400 group-hover:text-indigo-500" />
          ) : (
            <ArrowUpOnSquareIcon
              className={classNames(
                "w-32 h-32 text-gray-400 group-hover:text-indigo-500",
                isSubmitted && !selectedFile ? "text-red-500" : ""
              )}
            />
          )}
          <p
            className={classNames(
              "font-medium group-hover:text-indigo-500",
              isSubmitted && !selectedFile ? "text-red-400" : "",
              selectedFile ? "text-indigo-400" : "text-gray-400"
            )}
          >
            {selectedFile ? selectedFile.name : "Click here to attach file"}
          </p>
        </button>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter name"
              required
            />
          </div>
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600" id="email-error">
              {errorMessage}
            </p>
          )}
        </div>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          onChange={handleFileChange}
        />
        <div className="text-center">
          <Button type="submit" className="w-full">
            Upload {uploadProgress > 0 && `${uploadProgress}%`}
          </Button>
        </div>
      </form>
    </div>
  )
}
