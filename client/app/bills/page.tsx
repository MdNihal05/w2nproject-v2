"use client";
import { BillForm } from "@/components/bills/bill-form";
import { RootState } from "@/lib/store/store";
import React from "react";
import { useSelector } from "react-redux";

const Billage = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return isAuthenticated ? (
    <BillForm />
  ) : (
    <h1 className="text-2xl  bg-purple-500 shadow-md rounded-md p-8">
      Your are not Authunticated, Please Login to continue...
    </h1>
  );
};

export default Billage;
