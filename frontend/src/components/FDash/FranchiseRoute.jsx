import { Outlet } from "react-router";
import SideBar from "./SideBar";

function FranchiseRoute() {
  return (
    // h-screen aur overflow-hidden yahan lagao taaki poora page na hile
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* p-6 ko hata kar dashboard ke andar hi padding manage karenge */}
        <Outlet />
      </div>
    </div>
  );
}

export default FranchiseRoute;