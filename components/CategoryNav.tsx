import Link from 'next/link';
import CategoryCard from './Categorycard';
import type { Country } from '@/lib/shopify';

const collections = [
  { name: 'T-Shirts', handle: 'tshirts', image: '/TJ.jpg' },
  { name: 'Shirts', handle: 'shirts', image: '/S7.jpg' },
  { name: 'Pants', handle: 'pants', image: '/4.jpg' },
  { name: 'Hoodies', handle: 'hoodies', image: '/S4.jpg' },
];

interface CategoryNavProps {
  /** Collection handle of the page being viewed; '' means All Products. */
  active?: string;
  country?: Country;
}

// Shared across /shop and each category page so the nav never disappears and
// always underlines wherever the shopper currently is.
export default function CategoryNav({ active = '', country = 'CA' }: CategoryNavProps) {
  return (
    <div className="mb-3 sm:mb-5 flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Link
        href="/shop"
        className={`shrink-0 whitespace-nowrap pb-1 text-[11px] sm:text-xs font-bold uppercase transition-colors ${
          !active
            ? 'border-b border-black text-black'
            : 'border-b border-transparent text-neutral-500 hover:text-black'
        }`}
      >
        View All
      </Link>

      {collections.map(collection => (
        <CategoryCard
          key={collection.handle}
          name={collection.name}
          image={collection.image}
          handle={collection.handle}
          country={country}
          active={active === collection.handle}
        />
      ))}
    </div>
  );
}
