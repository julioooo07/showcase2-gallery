
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductDetailsModal from "../components/ProductDetailsModal";

function GalleryPage({ products, loading }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("default");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const categories = useMemo(() => {
        const uniqueCategories = products.map(
            (product) => product.category?.trim() || "Uncategorized"
        );

        return ["All", ...new Set(uniqueCategories)];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const result = products.filter((product) => {
            const matchesSearch = product.name
                .toLowerCase()
                .includes(search.trim().toLowerCase());

            const productCategory =
                product.category?.trim() || "Uncategorized";

            const matchesCategory =
                category === "All" || productCategory === category;

            return matchesSearch && matchesCategory;
        });

        if (sortOrder === "low") {
            result.sort((a, b) => Number(a.price) - Number(b.price));
        }

        if (sortOrder === "high") {
            result.sort((a, b) => Number(b.price) - Number(a.price));
        }

        return result;
    }, [products, search, category, sortOrder]);

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Product Gallery
                </h1>

                <p className="mt-2 text-slate-500">
                    Explore our collection of products.
                </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500"
                    aria-label="Sort products by price"
                >
                    <option value="default">Default Sorting</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                </select>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => setCategory(item)}
                        className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                            category === item
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-indigo-50"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <p className="mb-5 text-sm text-slate-500">
                Showing {filteredProducts.length} product(s)
            </p>

            {loading ? (
                <p className="py-12 text-center text-slate-500">
                    Loading products...
                </p>
            ) : filteredProducts.length === 0 ? (
                <div className="rounded-2xl bg-white p-12 text-center text-slate-500 ring-1 ring-slate-200">
                    No products found.
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            onClick={setSelectedProduct}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

export default GalleryPage;
