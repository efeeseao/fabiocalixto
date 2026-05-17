import { DashboardChart } from "@/components/admin/dashboard-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DocumentCodeIcon,
  Briefcase02Icon,
  UserMultiple02Icon,
  WorkHistoryIcon,
} from "hugeicons-react";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getAnalyticsData } from "@/app/actions/analytics";

export default async function DashboardPage() {
  const [statsRes, analyticsRes] = await Promise.all([
    getDashboardStats(),
    getAnalyticsData(),
  ]);

  const stats = statsRes.data;
  const analytics = analyticsRes.data;

  const isPositive = (analytics?.percentageChange ?? 0) >= 0;
  const percentageColor = isPositive ? "text-emerald-500" : "text-destructive";
  const percentageSymbol = isPositive ? "+" : "";

  return (
    <div className="w-full space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta. Aqui está o resumo do teu portfólio e blog.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Artigos
            </CardTitle>
            <DocumentCodeIcon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.posts ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Publicados e rascunhos.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projetos Ativos
            </CardTitle>
            <Briefcase02Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projects ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              No teu portfólio.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Subscritores
            </CardTitle>
            <UserMultiple02Icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.subscribers ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Inscritos na newsletter.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Visualizações (Mês)
            </CardTitle>
            <WorkHistoryIcon className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.currentViews ?? 0}
            </div>
            <p className={`text-xs mt-1 font-medium ${percentageColor}`}>
              {percentageSymbol}
              {analytics?.percentageChange ?? 0}% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-5">
        <DashboardChart data={analytics?.chartData ?? []} />

        <Card className="col-span-1 lg:col-span-1 border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <a
              href="/cms/posts/new"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary/50" /> Escrever
              Novo Artigo
            </a>
            <a
              href="/cms/projects/new"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary/50" /> Adicionar
              Projeto
            </a>
            <a
              href="/cms/settings"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-primary/50" /> Atualizar
              Definições
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
