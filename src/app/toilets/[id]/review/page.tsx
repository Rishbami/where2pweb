import { ReviewPage } from "@/components/review-page";

export default async function ToiletReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReviewPage id={id} />;
}
