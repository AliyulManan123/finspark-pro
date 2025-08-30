import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Icons } from "@/components/ui/icons";
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
import { AddGoalDialog } from "@/components/dashboard/AddGoalDialog";
import { AddFundsDialog } from "@/components/dashboard/AddFundsDialog"; // Dialog baru
import { getSavingsGoals, deleteGoal } from "@/services/api";
import { EmptyState } from "@/components/common/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

// Fungsi untuk memformat mata uang
const formatCurrency = (value: number | null | undefined) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

const Goals: React.FC = () => {
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [isAddFundsDialogOpen, setIsAddFundsDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Tables<'savings_goals'> | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["savingsGoals"],
    queryFn: getSavingsGoals,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      toast({ title: "Sukses", description: "Tujuan berhasil dihapus." });
      queryClient.invalidateQueries({ queryKey: ["savingsGoals"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal menghapus tujuan: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleAddFundsClick = (goal: Tables<'savings_goals'>) => {
    setSelectedGoal(goal);
    setIsAddFundsDialogOpen(true);
  };

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

    if (goals.length === 0) {
      return (
        <EmptyState
          icon="target"
          title="Belum Ada Tujuan"
          description="Buat tujuan pertama Anda untuk mulai menabung demi impian Anda."
          action={
            <Button onClick={() => setIsAddGoalDialogOpen(true)}>
              <Icons.plus className="mr-2 h-4 w-4" />
              Buat Tujuan Baru
            </Button>
          }
        />
      );
    }

    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => {
          const current = goal.current_amount || 0;
          const target = goal.target_amount;
          const percentage = (current / target) * 100;

          return (
            <Card key={goal.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle>{goal.name}</CardTitle>
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
                            Tindakan ini tidak dapat dibatalkan. Ini akan menghapus tujuan tabungan secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(goal.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
                <CardDescription>
                  Target: {formatCurrency(target)}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-grow">
                <div className="space-y-1">
                    <div className="flex justify-between items-end mb-1">
                        <span className="text-2xl font-bold">{formatCurrency(current)}</span>
                        <span className="text-sm text-muted-foreground">{percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={percentage} />
                </div>
              </CardContent>
              <CardFooter>
                  <Button className="w-full" onClick={() => handleAddFundsClick(goal)}>
                      <Icons.plus className="mr-2 h-4 w-4"/>
                      Tambah Dana
                  </Button>
              </CardFooter>
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
            <h1 className="text-3xl font-bold">Tujuan Keuangan</h1>
            <p className="text-muted-foreground">
              Tetapkan dan pantau tujuan keuangan Anda.
            </p>
          </div>
          <Button onClick={() => setIsAddGoalDialogOpen(true)}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Tambah Tujuan
          </Button>
        </div>
        {renderContent()}
      </div>
      <AddGoalDialog
        open={isAddGoalDialogOpen}
        onOpenChange={setIsAddGoalDialogOpen}
      />
      <AddFundsDialog
        open={isAddFundsDialogOpen}
        onOpenChange={setIsAddFundsDialogOpen}
        goal={selectedGoal}
      />
    </>
  );
};

export default Goals;

