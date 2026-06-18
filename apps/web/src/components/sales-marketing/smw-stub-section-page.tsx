import { SmwListShell } from "@/components/sales-marketing/smw-page-shell";
import { SmwSectionPlaceholder } from "@/components/sales-marketing/smw-section-placeholder";

type Props = {
  title: string;
  subtitle: string;
  placeholderTitle: string;
  placeholderDescription: string;
};

export function SmwStubSectionPage({
  title,
  subtitle,
  placeholderTitle,
  placeholderDescription,
}: Props) {
  return (
    <SmwListShell title={title} subtitle={subtitle}>
      <SmwSectionPlaceholder title={placeholderTitle} description={placeholderDescription} />
    </SmwListShell>
  );
}
