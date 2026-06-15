import { AccountDashboard } from "@/components/storefront/account/account-dashboard";

export const metadata = {
  title: "My account — AgainShop",
  description: "Your AgainShop dashboard — orders, rewards, wallet, and account settings.",
  robots: { index: false, follow: false },
};

export default function AccountDashboardPage() {
  return <AccountDashboard />;
}
