import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom"
import { HomePage } from "./pages/home/HomePage"
import { IngestCreate } from "./pages/ingests/IngestCreate"
import { BaseLayout } from "./components/BaseLayout"
import { IngestDetail } from "./pages/ingests/IngestDetail"
import { IngestList } from "./pages/ingests/IngestList"

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<BaseLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/ingests" element={<IngestList />} />
      <Route path="/ingests/create" element={<IngestCreate />} />
      <Route path="/ingests/:id" element={<IngestDetail />} />
    </Route>
  )
)
