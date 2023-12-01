import { SideNavComponent } from "../../components";
export default function DashboardPage() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }

  return <SideNavComponent />;
}
