import React, { useState, useEffect } from "react";
import axiosInstance from "@/components/AxiosInstance";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function ExpenseList() {
  const [expenseDetail, setExpenseDetail] = useState({
    name: "",
    expenseOn: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    companyName: localStorage.getItem("companyName") || "",
    email: localStorage.getItem("companyEmail") || "",
    expenseType: "",
    paymentMethod: "",
    notes: "",
    company: {
      companyId: localStorage.getItem("companyId"),
    },
  });

  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      const response = await axiosInstance.get("/expense/all");
      setExpenses(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddExpense = async () => {
    try {
      if (
        !expenseDetail.name ||
        !expenseDetail.expenseOn ||
        !expenseDetail.amount ||
        !expenseDetail.expenseType ||
        !expenseDetail.paymentMethod
      ) {
        toast.error("Please fill out all required fields.");
        return;
      }

      await axiosInstance.post("/expense/add", expenseDetail);
      toast.success("Expense added successfully!");
      setExpenseDetail({
        name: "",
        expenseOn: "",
        date: new Date().toISOString().split("T")[0],
        amount: "",
        companyName: localStorage.getItem("companyName") || "",
        email: localStorage.getItem("companyEmail") || "",
        expenseType: "",
        paymentMethod: "",
        notes: "",
        company: {
          companyId: localStorage.getItem("companyId"),
        },
      });
      setIsDialogOpen(false);
      fetchExpenses(); // Refresh the table after adding an expense
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense. Please try again.");
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(dateString));
  };

  return (
    <div>
      {/* Add Expense Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>Add Expense</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={expenseDetail.name}
                onChange={handleChange}
                placeholder="Enter expense name"
              />
            </div>
            <div>
              <Label htmlFor="expenseOn">Expense On</Label>
              <Input
                type="text"
                id="expenseOn"
                name="expenseOn"
                value={expenseDetail.expenseOn}
                onChange={handleChange}
                placeholder="Enter what the expense is for"
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={expenseDetail.date}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                type="number"
                id="amount"
                name="amount"
                value={expenseDetail.amount}
                onChange={handleChange}
                placeholder="Enter expense amount"
              />
            </div>
            <div>
              <Label htmlFor="expenseType">Expense Type</Label>
              <Input
                type="text"
                id="expenseType"
                name="expenseType"
                value={expenseDetail.expenseType}
                onChange={handleChange}
                placeholder="Enter expense type (e.g., Operational)"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Input
                type="text"
                id="paymentMethod"
                name="paymentMethod"
                value={expenseDetail.paymentMethod}
                onChange={handleChange}
                placeholder="Enter payment method (e.g., Credit Card)"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={expenseDetail.notes}
                onChange={handleChange}
                placeholder="Additional details about the expense"
              />
            </div>
            <div className="mt-4">
              <Button onClick={handleAddExpense}>Save Expense</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expense Table */}
      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Expense On</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Expense Type</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length > 0 ? (
              expenses.map((expense, index) => (
                <TableRow key={index}>
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.expenseOn}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>INR {expense.amount}</TableCell>
                  <TableCell>{expense.expenseType}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>{expense.notes || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" className="text-center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ExpenseList;
