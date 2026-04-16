import CategoryPageTemplate from '@/components/CategoryPageTemplate';

export const dynamic = 'force-dynamic';

export default function ArabesPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
      <CategoryPageTemplate title="Perfumes Árabes" categoryFilter="Arabe" />
    </div>
  );
}
