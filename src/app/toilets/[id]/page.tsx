import { ToiletDetailShell } from "@/components/toilet-detail-shell";

export default async function ToiletDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ToiletDetailShell id={id} />;
}
