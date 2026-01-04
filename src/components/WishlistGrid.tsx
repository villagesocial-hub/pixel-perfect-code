import { useWishlist } from "@/contexts/WishlistContext";
import { WishlistCard } from "./WishlistCard";
import { EmptyWishlist } from "./EmptyWishlist";

export const WishlistGrid = () => {
  const { items } = useWishlist();

  if (items.length === 0) {
    return <EmptyWishlist />;
  }

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <WishlistCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};
