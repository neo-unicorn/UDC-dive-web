import Link from 'next/link';

export function Pagination({ page, pages, baseUrl }: { page: number; pages: number; baseUrl: string }) {
    if (pages <= 1) return null;
    const getUrl = (p: number) => `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${p}`;
    return (
        <nav className="flex items-center justify-center gap-2 mt-8" data-testid="pagination">
            {page > 1 ? <Link href={getUrl(page - 1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50">←</Link> : <span className="px-3 py-2 bg-gray-100 border rounded-lg text-gray-400">←</span>}
            {Array.from({ length: Math.min(5, pages) }, (_, i) => i + Math.max(1, page - 2)).filter(p => p >= 1 && p <= pages).map(p => p === page ? <span key={p} className="px-3 py-2 bg-blue-500 text-white rounded-lg">{p}</span> : <Link key={p} href={getUrl(p)} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50">{p}</Link>)}
            {page < pages ? <Link href={getUrl(page + 1)} className="px-3 py-2 bg-white border rounded-lg hover:bg-gray-50">→</Link> : <span className="px-3 py-2 bg-gray-100 border rounded-lg text-gray-400">→</span>}
        </nav>
    );
}
export default Pagination;
