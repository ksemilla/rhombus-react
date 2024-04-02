import { Outlet } from "react-router-dom"
import { Nav } from "./Nav"

export function BaseLayout() {
  return (
    <div>
      <Nav />
      <div className="max-w-7xl m-auto mt-8">
        <Outlet />
      </div>
    </div>
  )
}
