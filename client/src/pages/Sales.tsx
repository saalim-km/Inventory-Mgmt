"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useFormik } from "formik";
import { useLocation } from "react-router-dom";
import { AxiosError } from "axios";
import { 
  CreditCard, 
  Wallet, 
  Banknote, 
  Smartphone, 
  Truck,
  DollarSign
} from "lucide-react";
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
  const itemsPerPage = 10;
  const location = useLocation();

  // Payment types with icons
  const paymentTypes = [
    { value: "cash", label: "Cash", icon: <Banknote className="w-4 h-4 mr-2" /> },
    { value: "upi", label: "UPI", icon: <Smartphone className="w-4 h-4 mr-2" /> },
    { value: "card", label: "Credit/Debit Card", icon: <CreditCard className="w-4 h-4 mr-2" /> },
    { value: "bank_transfer", label: "Bank Transfer", icon: <Wallet className="w-4 h-4 mr-2" /> },
    { value: "cod", label: "Cash on Delivery", icon: <Truck className="w-4 h-4 mr-2" /> },
  ];

  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetchSale({
          limit: itemsPerPage,
          page: currentPage
        });
        setSales(response.data.data);
        setTotalDataCount(response.data.total);
      } catch (error) {
        handleError(error);
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
        handleError(error);
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
        handleError(error);
      }
    }
    fetchItemsData();
  }, [location]);

  const formik = useFormik({
    initialValues: {
      date: null as Date | null,
      customerName: "",
      paymentType: "cash",
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
          paymentType: values.paymentType,
          items: values.items,
        };
        
        try {
          const response = await addSale(saleData);
          setSales((prev) => [response.data, ...prev]);
          setTotalDataCount(prev => prev + 1);
          toast.success(response.message);
          resetForm();
        } catch (error) {
          handleError(error);
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
      key: "paymentType",
      header: "Payment",
      render: (value) => {
        const payment = paymentTypes.find(p => p.value === value);
        return payment ? payment.label : value;
      }
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

  const totalAmount = formik.values.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Sales Management</h1>
          <p className="text-gray-600">Record and manage sales transactions</p>
        </div>

        <Card className="w-full border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
              New Sale Record
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date Picker */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date</Label>
                  <DatePicker
                    selected={formik.values.date}
                    onChange={(date) => formik.setFieldValue("date", date)}
                    placeholder="Select date"
                    className="w-full"
                  />
                  {formik.touched.date && formik.errors.date && (
                    <p className="text-sm text-red-500">{formik.errors.date}</p>
                  )}
                </div>

                {/* Customer Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Customer</Label>
                  <Select
                    value={formik.values.customerName}
                    onValueChange={(value) =>
                      formik.setFieldValue("customerName", value)
                    }
                  >
                    <SelectTrigger className="w-full text-left">
                      <SelectValue placeholder="Select customer" />
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

                {/* Payment Type Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Payment Type</Label>
                  <Select
                    value={formik.values.paymentType}
                    onValueChange={(value) =>
                      formik.setFieldValue("paymentType", value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select payment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentTypes.map((payment) => (
                        <SelectItem key={payment.value} value={payment.value}>
                          <div className="flex items-center">
                            {payment.icon}
                            {payment.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Select */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Add Item</Label>
                  <Select onValueChange={handleAddItem}>
                    <SelectTrigger className="w-full text-left">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem 
                          key={item._id} 
                          value={item.name}
                          disabled={item.quantity <= 0}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{item.name}</span>
                            <span className="text-sm text-gray-500">
                              Stock: {item.quantity}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Items Table */}
              {formik.values.items.length > 0 && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold mb-4 text-base text-gray-800">Selected Items</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead className="bg-gray-100 text-left">
                        <tr>
                          <th className="px-4 py-3 font-medium text-gray-700">Item</th>
                          <th className="px-4 py-3 font-medium text-gray-700">Stock</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-700">Quantity</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Unit Price</th>
                          <th className="px-4 py-3 text-right font-medium text-gray-700">Total</th>
                          <th className="px-4 py-3 text-center font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formik.values.items.map((item, index) => (
                          <tr
                            key={item.name}
                            className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                          >
                            <td className="px-4 py-3 text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-gray-600">{item.stock}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  disabled={item.quantity === 1}
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.name, -1)}
                                  className="h-8 w-8 p-0"
                                >
                                  −
                                </Button>
                                <span className="w-8 text-center font-medium text-gray-800">
                                  {item.quantity}
                                </span>
                                <Button
                                  disabled={item.quantity === item.stock}
                                  type="button"
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleQuantityChange(item.name, 1)}
                                  className="h-8 w-8 p-0"
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-800">
                              ₹{item.price.toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-right font-medium text-gray-800">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveItem(item.name)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-between items-center mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <div className="text-sm text-blue-700">
                      Payment: {paymentTypes.find(p => p.value === formik.values.paymentType)?.label}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-blue-800">
                        Grand Total: ₹{totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700"
                disabled={formik.values.items.length === 0}
              >
                Save Sale Record
              </Button>
            </form>

            <div className="pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-lg mb-4 text-gray-800">Sales History</h3>
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
      </div>
    </DashboardLayout>
  );
};