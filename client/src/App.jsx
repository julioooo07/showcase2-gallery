
import { useEffect, useState, useCallback } from "react";
import NavBar from "./components/NavBar";
import GalleryPage from "./pages/GalleryPage";
import ManagePage from "./pages/ManagePage";

const API_URL = "http://localhost:5000/api/products";

function App() {
    const [products, setProducts] = useState([]);
    const [view, setView] = useState("gallery");
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // FETCH PRODUCTS FROM BACKEND
    const fetchProducts = useCallback(async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid products response");
            }

            setProducts(data);
            setError("");

            return true;
        } catch (error) {
            console.error("Fetch Error:", error);
            setError(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // LOAD PRODUCTS WHEN APPLICATION STARTS
    useEffect(() => {
        let cancelled = false;

        const loadProducts = async () => {
            try {
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid products response");
                }

                if (!cancelled) {
                    setProducts(data);
                    setError("");
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Fetch Error:", error);
                    setError(error.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    // ADD OR UPDATE PRODUCT IN BACKEND
    const saveProduct = async (productData) => {
        try {
            setError("");

            const isEditing = Boolean(editingProduct);

            const url = isEditing
                ? `${API_URL}/${editingProduct._id}`
                : API_URL;

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({}));

                throw new Error(
                    errorData.message ||
                    `Failed to ${isEditing ? "update" : "add"} product`
                );
            }

            // REFRESH PRODUCTS FROM BACKEND
            const refreshed = await fetchProducts();

            if (!refreshed) {
                return false;
            }

            setEditingProduct(null);

            return true;
        } catch (error) {
            console.error("Save Error:", error);
            setError(error.message);
            return false;
        }
    };

    // DELETE PRODUCT FROM BACKEND
    const deleteProduct = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return false;
        }

        try {
            setError("");

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response
                    .json()
                    .catch(() => ({}));

                throw new Error(
                    errorData.message || "Failed to delete product"
                );
            }

            // REFRESH PRODUCTS FROM BACKEND
            const refreshed = await fetchProducts();

            if (!refreshed) {
                return false;
            }

            if (editingProduct?._id === id) {
                setEditingProduct(null);
            }

            return true;
        } catch (error) {
            console.error("Delete Error:", error);
            setError(error.message);
            return false;
        }
    };

    // SELECT PRODUCT TO EDIT
    const startEdit = (product) => {
        setEditingProduct(product);
        setView("manage");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // CHANGE PAGE
    const changeView = (newView) => {
        setView(newView);
        setEditingProduct(null);
        setError("");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">

            <NavBar
                view={view}
                onChangeView={changeView}
            />

            <main className="flex-1">

                {error && (
                    <div className="mx-auto max-w-6xl px-4 pt-5">
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                            {error}
                        </div>
                    </div>
                )}

                {view === "gallery" ? (
                    <GalleryPage
                        products={products}
                        loading={loading}
                    />
                ) : (
                    <ManagePage
                        products={products}
                        editingProduct={editingProduct}
                        onSave={saveProduct}
                        onCancel={() => setEditingProduct(null)}
                        onEdit={startEdit}
                        onDelete={deleteProduct}
                    />
                )}

            </main>

            <footer className="py-10 text-center text-sm text-slate-400">
                Made by Julius Nunez • INF233
            </footer>

        </div>
    );
}

export default App;
