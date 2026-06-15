import { AccountAddressesView } from "@/components/storefront/account/account-addresses-view";

export const metadata = {
  title: "Addresses — My account — AgainShop",
  robots: { index: false, follow: false },
};

export default function AccountAddressesPage() {
  return <AccountAddressesView />;
}
