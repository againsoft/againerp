import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: Props) {
  const { id } = await params;
  redirect(`/catalog/products?view=${id}`);
}
