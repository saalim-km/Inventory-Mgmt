"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import type { ICustomer, IItem, ISale, TableColumn } from "../types/auth.type";
import {
  addSale,
  fetchCustomer,
  fetchItems,
  fetchSale,
} from "../service/services";
import { saleValidationSchema } from "../utils/formik/schemas";
import { DashboardLayout } from "../components/Layout";
import { DatePicker } from "../components/ui/date-picker";
import { ReusableTable } from "../components/Table";
import { Select, SelectContent, SelectItem, SelectValue } from "../components/ui/select";
import { SelectTrigger } from "@radix-ui/react-select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { handleError } from "../utils/error-handler";

export const SaleManagement = () => {
  const [sales, setSales] = useState<ISale[]>([]);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;
  const location = useLocation();

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetchSale({
          limit: itemsPerPage,
          page : currentPage
        });
        console.log(response);
        setSales(response.data.data);
        setTotalDataCount(response.data.total);
      } catch (error) {
        handleError(error)
      }
    }
    fetchSales();
  }, [location, currentPage]);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetchCustomer({ page: 1, limit: 100 });
        setCustomers(response.data.data);
      } catch (error) {
        handleError(error)
      }
    }
    fetchCustomers();
  }, [location]);

  useEffect(() => {
    async function fetchItemsData() {
      try {
        const response = await fetchItems({ page: 1, limit: 100 });
        setItems(response.data.data);
      } catch (error) {
        handleError(error)
      }
    }
    fetchItemsData();
  }, [location]);

  const formik = useFormik({
    initialValues: {
      date: null as Date | null,
      customerName: "",
      items: [] as {
        name: string;
        quantity: number;
        price: number;
        stock: number;
      }[],
    },
    validationSchema: saleValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!values.date) {
          toast.error("Date is required");
          return;
        }

        const saleData: Omit<ISale, "_id"> = {
          date: values.date,
          customerName: values.customerName,
          items: values.items,
        };
        try {
          const response = await addSale(saleData);
          setSales((prev)=> [response.data,...prev])
          toast.success(response.message);
          resetForm();
        } catch (error) {
          handleError(error)
        }
      } catch (error) {
        toast.error(
          error instanceof AxiosError
            ? error.response?.data.message
            : "Error in Submitting"
        );
      }
    },
  });

  const handleAddItem = (itemName: string) => {
    if (!formik.values.items.find((i) => i.name === itemName)) {
      const matchedItem = items.find((i) => i.name === itemName);
      if (!matchedItem) return;
      if (matchedItem.quantity <= 0) {
        toast.error("Item is out of stock");
        return;
      }
      formik.setFieldValue("items", [
        ...formik.values.items,
        {
          _id: matchedItem._id,
          name: matchedItem.name,
          quantity: 1,
          price: matchedItem.price,
          stock: matchedItem.quantity,
        },
      ]);
    }
  };

  const handleQuantityChange = (item: string, delta: number) => {
    const updatedItems = formik.values.items.map((i) =>
      i.name === item ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    );
    formik.setFieldValue("items", updatedItems);
  };

  const handleRemoveItem = (item: string) => {
    const filtered = formik.values.items.filter((i) => i.name !== item);
    formik.setFieldValue("items", filtered);
  };

  const saleColumns: TableColumn<ISale>[] = [
    {
      key: "date",
      header: "Date",
      render: (value) => new Date(value as Date).toLocaleDateString(),
    },
    {
      key: "customerName",
      header: "Customer",
    },
    {
      key: "items",
      header: "Items",
      render: (_, row) =>
        row.items.map((i) => `${i.name} (${i.quantity})`).join(", "),
    },
    {
      key: "items",
      header: "Total Amount",
      render: (_, row) =>
        `₹ ${row.items
          .reduce((sum, i) => sum + i.price * i.quantity, 0)
          .toFixed(2)}`,
    },
  ];

  return (
    <DashboardLayout>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Sale Record</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  selected={formik.values.date}
                  onChange={(date) => formik.setFieldValue("date", date)}
                  placeholder="Select date"
                />
                {formik.touched.date && formik.errors.date && (
                  <p className="text-sm text-red-500">{formik.errors.date}</p>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="customerName">Customer</Label>
                <Select
                  value={formik.values.customerName}
                  onValueChange={(value) =>
                    formik.setFieldValue("customerName", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.customerName && formik.errors.customerName && (
                  <p className="text-sm text-red-500">
                    {formik.errors.customerName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="items">Add Item</Label>
                <Select onValueChange={handleAddItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item" />
                  </SelectTrigger>
                  <SelectContent>
                    {items.map((item) => (
                      <SelectItem key={item._id} value={item.name}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.items &&
                  typeof formik.errors.items === "string" && (
                    <p className="text-sm text-red-500">
                      {formik.errors.items}
                    </p>
                  )}
              </div>
            </div>

            {/* Selected Items Table */}
            {formik.values.items.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-semibold mb-4 text-base">Selected Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-muted text-left">
                      <tr>
                        <th className="px-4 py-3 font-medium">Item</th>
                        <th className="px-4 py-3 font-medium">
                          Available Stock
                        </th>
                        <th className="px-4 py-3 text-center font-medium">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Unit Price (₹)
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Total (₹)
                        </th>
                        <th className="px-4 py-3 text-center font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {formik.values.items.map((item, index) => (
                        <tr
                          key={item.name}
                          className={
                            index % 2 === 0 ? "bg-background" : "bg-muted/30"
                          }
                        >
                          <td className="px-4 py-3">{item.name}</td>
                          <td className="px-4 py-3">{item.stock}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <Button
                                disabled={item.quantity === 1}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(item.name, -1)
                                }
                              >
                                −
                              </Button>
                              <span className="w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                disabled={item.quantity === item.stock}
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleQuantityChange(item.name, 1)
                                }
                              >
                                +
                              </Button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            ₹ {item.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-right font-medium">
                            ₹ {(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveItem(item.name)}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right font-semibold text-lg mt-4 p-4 bg-muted rounded-md">
                  Grand Total: ₹{" "}
                  {formik.values.items
                    .reduce((sum, i) => sum + i.price * i.quantity, 0)
                    .toFixed(2)}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full md:w-auto">
              Save Sale
            </Button>
          </form>

          <div className="pt-6 border-t">
            <h3 className="font-semibold text-lg mb-4">Sales List</h3>
            <ReusableTable
              currentPage={currentPage}
              columns={saleColumns}
              data={sales}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              totalItems={totalDataCount}
            />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};
