"use client";
import { BillList } from "@/components/bills/bill-list";
import { RootState } from "@/lib/store/store";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? (
    <div className=" space-y-8 text-white min-w-screen min-h-screen">
      <h1 className="text-4xl font-bold text-center m-2 border border-purple-600 rounded-full p-2   ">
        Dashboard
      </h1>
      <div className="flex items-center jus">
        <BillList />
      </div>
    </div>
  ) : (
    <h1 className="text-2xl bg-purple-500 shadow-md rounded-md p-8">
      Your are not Authunticated, Please Login to continue...
    </h1>
  );
}
