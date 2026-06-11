import { ProductGridSkeleton, SectionSkeleton } from "@/components/states";

export default function LoadingShopPage() {
  return (
    <div className="content-shell py-10 md:py-14">
      <SectionSkeleton />
      <div className="mt-8 h-20 animate-pulse rounded-[2rem] bg-white/70" />
      <div className="mt-8">
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
