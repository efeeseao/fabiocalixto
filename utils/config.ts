import {
  DashboardSquare01Icon,
  Settings01Icon,
  DocumentCodeIcon,
  Briefcase02Icon,
  WorkHistoryIcon,
  UserMultiple02Icon,
} from "hugeicons-react";

export const cmsNavLinks = [
  { name: "Dashboard", href: "/cms", icon: DashboardSquare01Icon },
  { name: "Artigos", href: "/cms/posts", icon: DocumentCodeIcon },
  { name: "Projetos", href: "/cms/projects", icon: Briefcase02Icon },
  { name: "Experiências", href: "/cms/experiences", icon: WorkHistoryIcon },
  {
    name: "Subscritores",
    href: "/cms/subscribers",
    icon: UserMultiple02Icon,
  },
  { name: "Definições", href: "/cms/settings", icon: Settings01Icon },
];
