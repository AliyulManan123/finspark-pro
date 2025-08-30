import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/ui/icons";
import { AddBudgetDialog } from "@/components/dashboard/AddBudgetDialog";
import { getBudgets, deleteBudget } from "@/services/api";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Fungsi untuk memformat mata uang
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

const Budgets: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: budgets = [], isLoading } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      toast({
        title: "Sukses",
        description: "Anggaran berhasil dihapus.",
      });
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
    },
    onError: (error) => {
       toast({
        title: "Error",
        description: `Gagal menghapus anggaran: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (budgets.length === 0) {
      return (
        <EmptyState
          icon="pieChart"
          title="Belum Ada Anggaran"
          description="Buat anggaran pertama Anda untuk mulai melacak pengeluaran."
          action={
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Buat Anggaran Baru
            </Button>
          }
        />
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget: any) => {
          const spent = budget.spent || 0;
          const remaining = budget.amount - spent;
          const percentage = (spent / budget.amount) * 100;
          const isOverBudget = remaining < 0;

          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{budget.name}</CardTitle>
                    <CardDescription>{budget.categories?.name || 'Tanpa Kategori'}</CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icons.trash className="h-4 w-4 text-destructive" />
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Anda Yakin?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Ini akan menghapus anggaran secara permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteMutation.mutate(budget.id)}>Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-2xl font-bold">{formatCurrency(spent)}</span>
                        <span className="text-sm text-muted-foreground">/ {formatCurrency(budget.amount)}</span>
                    </div>
                    <Progress value={percentage} className={isOverBudget ? "[&>div]:bg-destructive" : ""}/>
                </div>
                <div className={`text-sm ${isOverBudget ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {isOverBudget 
                        ? `${formatCurrency(Math.abs(remaining))} melebihi anggaran` 
                        : `${formatCurrency(remaining)} tersisa`}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Anggaran</h1>
            <p className="text-muted-foreground">
              Rencanakan dan lacak anggaran pengeluaran Anda.
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Tambah Anggaran
          </Button>
        </div>
        {renderContent()}
      </div>
      <AddBudgetDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </>
  );
};

export default Budgets;

