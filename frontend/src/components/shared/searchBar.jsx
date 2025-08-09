export default function SearchBar() {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder="Cari Event"
                className="pl-9 pr-4 py-1.5 text-sm border rounded-full text-gray-700 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
        </div>
    );
}
