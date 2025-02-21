"use client";

import type React from "react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBill } from "@/lib/store/bills-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { AppDispatch } from "@/lib/store/store";
import type { FormData } from "@/types";

export function BillForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "",
    amount: "",
    note: "",
    date: "",
    files: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "files") {
          value.forEach((file: File) => form.append("files", file));
        } else {
          form.append(key, value);
        }
      });

      await dispatch(addBill(form)).unwrap();
      setFormData({
        name: "",
        category: "",
        amount: "",
        note: "",
        date: "",
        files: [],
      });
      toast({
        title: "Success",
        description: "Bill added successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to add bill",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add New Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2 text-black">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  className="text-black"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="files">Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    setFormData((prev) => ({
                      ...prev,
                      files: Array.from(files),
                    }));
                  }
                }}
              />
            </div>
            <Button type="submit" className="w-full">
              Add Bill
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
