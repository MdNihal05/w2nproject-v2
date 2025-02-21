"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBills, deleteBill, describeBills } from "@/lib/store/bills-slice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import type { AppDispatch, RootState } from "@/lib/store/store";
import type { Bill } from "@/types";

export function BillList() {
  const dispatch = useDispatch<AppDispatch>();
  const { bills, isLoading, analysis } = useSelector(
    (state: RootState) => state.bills
  );
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchBills());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteBill(id)).unwrap();
      toast({
        title: "Success",
        description: "Bill deleted successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    }
  };

  const handleDescribe = async () => {
    try {
      await dispatch(describeBills()).unwrap();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to analyze bills",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-evenly gap-8 flex-wrap">
        <h2 className="text-2xl font-bold">Your Bills</h2>
        <Button onClick={handleDescribe}>Analyze Bills</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {bills.map((bill: Bill) => (
          <BillCard key={bill._id} bill={bill} onDelete={handleDelete} />
        ))}
      </div>
      {analysis && (
        <Card className="bg-muted max-w-5xl m-">
          <CardContent className="pt-6">
            <p className="whitespace-pre-wrap text-wrap]">{analysis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function BillCard({
  bill,
  onDelete,
}: {
  bill: Bill;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{bill.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Category:</span> {bill.category}
          </p>
          <p>
            <span className="font-medium">Amount:</span> {bill.amount}
          </p>
          <p>
            <span className="font-medium">Date:</span>{" "}
            {new Date(bill.date).toLocaleDateString()}
          </p>
          {bill.note && (
            <p>
              <span className="font-medium">Note:</span> {bill.note}
            </p>
          )}
          {bill.files.length > 0 && (
            <div>
              <span className="font-medium">Files:</span>
              <ul className="list-disc list-inside">
                {bill.files.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {file.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full mt-4">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  bill.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(bill._id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
