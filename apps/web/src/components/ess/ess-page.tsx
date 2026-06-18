import { EssMobilePage } from "@/components/ess/mobile/ess-mobile-page";

type Props = {
  children: React.ReactNode;
};

/** @deprecated Use EssMobilePage — header provided by EssMobileShell */
export function EssPage({ children }: Props) {
  return <EssMobilePage>{children}</EssMobilePage>;
}
