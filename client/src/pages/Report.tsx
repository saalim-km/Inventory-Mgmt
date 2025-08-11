import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { CustomerLedger } from "../components/CustomerLedger";
import { ItemsReport } from "../components/ItemReport";
import { SalesReport } from "../components/SalesReport";
import { DashboardLayout } from "../components/Layout";

export const ReportsPage = () => {
    return (
        <DashboardLayout>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="sales" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="sales">Sales Report</TabsTrigger>
                            <TabsTrigger value="items">Items Report</TabsTrigger>
                            <TabsTrigger value="ledger">Customer Ledger</TabsTrigger>
                        </TabsList>

                        <TabsContent value="sales">
                            <SalesReport />
                        </TabsContent>

                        <TabsContent value="items">
                            <ItemsReport />
                        </TabsContent>

                        <TabsContent value="ledger">
                            <CustomerLedger />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </DashboardLayout>
    );
};