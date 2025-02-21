import { BillList } from "@/components/bills/bill-list";

export default function DashboardPage() {
  return (
    <div className=" space-y-8 text-white min-w-screen min-h-screen">
      <h1 className="text-4xl font-bold text-center m-2 border border-purple-600 rounded-full p-2   ">
        Dashboard
      </h1>
      <div className="flex items-center jus">
        <BillList />
      </div>
    </div>
  );
}
