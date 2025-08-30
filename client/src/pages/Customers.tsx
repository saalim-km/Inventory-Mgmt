import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { 
  Plus, 
  X, 
  User, 
  MapPin, 
  Phone, 
  Edit3, 
  Trash2,
  Users
} from "lucide-react";
import { customerValidationSchema } from "../utils/formik/schemas";
import { useConfirmModal } from "../hook/useModal";
import { DashboardLayout } from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ReusableTable } from "../components/Table";
import { ConfirmModal } from "../components/modals/ConfirmModal";
import { addCustomer, deleteCustomer, editCustomer, fetchCustomer } from "../service/services";
import { handleError } from "../utils/error-handler";

type Customer = {
  _id: string;
  name: string;
  address: string;
  mobile: string;
};

export const CustomerManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [totalCustomerCount, setTotalCustomerCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const itemsPerPage = 10;
  const location = useLocation();
  const confirmModal = useConfirmModal();

  // Fetch customers when page or location changes
  useEffect(() => {
    async function fetchCustomers() {
      try {
        const response = await fetchCustomer({
          limit: itemsPerPage,
          page: currentPage,
        });
        setCustomers(response.data.data);
        setTotalCustomerCount(response.data.total);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast.error("Failed to fetch customers");
      }
    }
    fetchCustomers();
  }, [currentPage, location]);

  const formik = useFormik({
    initialValues: { name: "", address: "", mobile: "" },
    validationSchema: customerValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setIsSubmitting(true);
        let response;
        if (selectedCustomer) {
          response = await editCustomer(selectedCustomer._id, {
            name: values.name,
            address: values.address,
            mobile: parseInt(values.mobile),
          });
          // Update state directly instead of refetching
          setCustomers((prev) =>
            prev.map((customer) =>
              customer._id === selectedCustomer._id
                ? {
                    ...customer,
                    name: values.name,
                    address: values.address,
                    mobile: values.mobile,
                  }
                : customer
            )
          );
          toast.success(response.message || "Customer updated successfully");
          setSelectedCustomer(null);
          resetForm();
        } else {
          response = await addCustomer({
            name: values.name,
            address: values.address,
            mobile: parseInt(values.mobile),
          });
          toast.success(response.message || "Customer added successfully");
          resetForm();
          // Refresh customer list after add
          const responseData = await fetchCustomer({
            limit: itemsPerPage,
            page: currentPage,
          });
          setCustomers(responseData.data.data);
          setTotalCustomerCount(responseData.data.total);
        }
      } catch (error) {
        console.error("Error in form submission:", error);
        handleError(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const columns = [
    { 
      key: "name", 
      header: "Name",
      render: (value: string) => (
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <span className="font-medium text-gray-800">{value}</span>
        </div>
      )
    },
    { 
      key: "address", 
      header: "Address",
      render: (value: string) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
          <span className="truncate max-w-[200px]">{value}</span>
        </div>
      )
    },
    { 
      key: "mobile", 
      header: "Mobile",
      render: (value: string) => (
        <div className="flex items-center text-gray-600">
          <Phone className="w-4 h-4 mr-1 text-gray-400" />
          <span>{value}</span>
        </div>
      )
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit3 className="w-4 h-4 mr-2" />,
      onClick: (row: Customer) => {
        formik.setValues({
          name: row.name,
          address: row.address,
          mobile: row.mobile,
        });
        setSelectedCustomer(row);
        // Scroll to form
        document.getElementById('customer-form')?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4 mr-2" />,
      variant: "destructive" as const,
      onClick: (row: Customer) => {
        confirmModal.openModal({
          title: "Delete Customer",
          description: `Are you sure you want to delete ${row.name}? This action cannot be undone.`,
          onConfirm: async () => {
            try {
              const response = await deleteCustomer(row._id);
              setCustomers(customers.filter((c) => c._id !== row._id));
              setTotalCustomerCount((prev) => prev - 1);
              if (
                customers.length === 1 &&
                currentPage > 1 &&
                (currentPage - 1) * itemsPerPage >= totalCustomerCount - 1
              ) {
                setCurrentPage((prev) => prev - 1);
              }
              confirmModal.closeModal();
              toast.success(response.message || "Customer deleted successfully");
            } catch (error) {
              console.error("Error deleting customer:", error);
              toast.error("Failed to delete customer");
            }
          },
        });
      },
    },
  ];

  const clearForm = () => {
    setSelectedCustomer(null);
    formik.resetForm();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
            <p className="text-gray-600">Manage your customer database efficiently</p>
          </div>
          <div className="flex items-center bg-blue-50 rounded-lg p-3">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">{totalCustomerCount} customers</span>
          </div>
        </div>

        <Card className="w-full border-0 shadow-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 align-middle">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-blue-600" />
              {selectedCustomer ? "Update Customer" : "Add New Customer"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form 
              id="customer-form"
              onSubmit={formik.handleSubmit} 
              className="space-y-4 mb-6" 
              noValidate
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Name
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="name"
                      placeholder="Customer name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-9 ${formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {formik.touched.name && formik.errors.name && (
                    <p className="text-sm text-red-500">{formik.errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Address
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="address"
                      placeholder="Customer address"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-9 ${formik.touched.address && formik.errors.address ? "border-red-500" : "border-gray-300"}`}
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-sm text-red-500">{formik.errors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    Mobile
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      name="mobile"
                      placeholder="Mobile number"
                      value={formik.values.mobile}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`pl-9 ${formik.touched.mobile && formik.errors.mobile ? "border-red-500" : "border-gray-300"}`}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {formik.touched.mobile && formik.errors.mobile && (
                    <p className="text-sm text-red-500">{formik.errors.mobile}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={formik.isSubmitting || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {selectedCustomer ? "Update Customer" : "Add Customer"}
                </Button>
                <Button
                  type="button"
                  onClick={clearForm}
                  variant="outline"
                  disabled={formik.isSubmitting || isSubmitting}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </form>

            <div className="border-t border-gray-200 pt-6">
              <ReusableTable
                columns={columns}
                currentPage={currentPage}
                data={customers}
                actions={actions}
                itemsPerPage={itemsPerPage}
                totalItems={totalCustomerCount}
                onPageChange={(page) => setCurrentPage(page)}
                isLoading={isSubmitting}
                emptyMessage="No customers found. Add your first customer to get started."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.closeModal}
      />
    </DashboardLayout>
  );
};