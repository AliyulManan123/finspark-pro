import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { addDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { getAllTransactions } from "@/services/api";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { Tables } from "@/integrations/supabase/types";

// Fungsi untuk memformat mata uang
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Warna untuk chart pie
const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

// Tipe data untuk rentang tanggal
type DateRange = {
  from: Date;
  to: Date;
};

const Reports: React.FC = () => {
  const [dateRangeOption, setDateRangeOption] = useState<string>("last30days");

  // Mendapatkan semua data transaksi
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["allTransactions"],
    queryFn: getAllTransactions,
  });

  // Logika untuk memfilter dan memproses data berdasarkan rentang tanggal yang dipilih
  const processedData = useMemo(() => {
    const now = new Date();
    let dateRange: DateRange;

    switch (dateRangeOption) {
      case "thisMonth":
        dateRange = { from: startOfMonth(now), to: endOfMonth(now) };
        break;
      case "thisYear":
        dateRange = { from: startOfYear(now), to: endOfYear(now) };
        break;
      case "last30days":
      default:
        dateRange = { from: addDays(now, -30), to: now };
        break;
    }

    const filtered = transactions.filter((t: Tables<'transactions'>) => {
      const transactionDate = new Date(t.transaction_date);
      return transactionDate >= dateRange.from && transactionDate <= dateRange.to;
    });

    const totalIncome = filtered
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filtered
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      
    const netFlow = totalIncome - totalExpense;

    const categoryBreakdown = filtered
      .filter((t: any) => t.type === 'expense' && t.categories)
      .reduce((acc, t: any) => {
        const categoryName = t.categories.name || 'Uncategorized';
        acc[categoryName] = (acc[categoryName] || 0) + Math.abs(t.amount);
        return acc;
      }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryBreakdown)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    return { totalIncome, totalExpense, netFlow, categoryData, incomeVsExpenseData: [{ name: 'Cash Flow', income: totalIncome, expense: totalExpense }] };
  }, [transactions, dateRangeOption]);

  const { totalIncome, totalExpense, netFlow, categoryData, incomeVsExpenseData } = processedData;

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-[400px] w-full" />;
    }

    if (transactions.length === 0) {
      return (
        <EmptyState
          icon="barChart"
          title="Belum Ada Data Laporan"
          description="Transaksi yang Anda catat akan muncul di sini sebagai laporan dan analisis."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Summary Cards */}
        <Card className="col-span-1 lg:col-span-2">
            <CardHeader>
                <CardTitle>Ringkasan Keuangan</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-green-500/10">
                    <h3 className="text-sm text-muted-foreground">Total Pemasukan</h3>
                    <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/10">
                    <h3 className="text-sm text-muted-foreground">Total Pengeluaran</h3>
                    <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
                </div>
                <div className="p-4 rounded-lg bg-blue-500/10">
                    <h3 className="text-sm text-muted-foreground">Arus Kas Bersih</h3>
                    <p className={`text-2xl font-bold ${netFlow >= 0 ? 'text-blue-500' : 'text-destructive'}`}>{formatCurrency(netFlow)}</p>
                </div>
            </CardContent>
        </Card>

        {/* Income vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pemasukan vs Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeVsExpenseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="income" fill="#10B981" name="Pemasukan" />
                <Bar dataKey="expense" fill="#EF4444" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Expense Breakdown Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rincian Pengeluaran per Kategori</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
             ) : (
                <EmptyState title="Tidak ada data pengeluaran" description="Tidak ada pengeluaran yang tercatat pada periode ini." icon="pieChart" />
             )}
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Analisis mendalam tentang kondisi keuangan Anda.
          </p>
        </div>
        <Select value={dateRangeOption} onValueChange={setDateRangeOption}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Pilih rentang waktu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last30days">30 Hari Terakhir</SelectItem>
            <SelectItem value="thisMonth">Bulan Ini</SelectItem>
            <SelectItem value="thisYear">Tahun Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderContent()}
    </div>
  );
};

export default Reports;

