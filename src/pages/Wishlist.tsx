import { WishlistHeader } from "@/components/WishlistHeader";
import { WishlistGrid } from "@/components/WishlistGrid";

const Wishlist = () => {
  return (
    <div className="min-h-screen bg-background">
      <WishlistHeader />
      <main className="max-w-[1600px] mx-auto">
        <WishlistGrid />
      </main>
    </div>
  );
};

export default Wishlist;
