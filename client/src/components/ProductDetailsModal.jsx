
import { useEffect } from "react";

function ProductDetailsModal({ product, onClose }) {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-modal-title"
                className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close product details"
                    className="absolute right-4 top-4 z-10 rounded-full bg-white px-3 py-2 font-bold text-slate-700 shadow hover:bg-slate-100"
                >
                    ✕
                </button>

                <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                />

                <div className="p-6">
                    <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {product.category || "Uncategorized"}
                    </span>

                    <h2
                        id="product-modal-title"
                        className="mt-4 text-2xl font-bold text-slate-900"
                    >
                        {product.name}
                    </h2>

                    <p className="mt-3 text-2xl font-bold text-indigo-600">
                        ₱{Number(product.price).toLocaleString()}
                    </p>

                    <h3 className="mt-6 font-semibold text-slate-800">
                        Description
                    </h3>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {product.description || "No description available."}
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-8 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailsModal;
