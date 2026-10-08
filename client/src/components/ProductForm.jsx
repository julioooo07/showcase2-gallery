
import { useState } from "react";
import ImageUpload from "./ImageUpload";

const emptyForm = {
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
};

const inputClass =
    "w-full rounded-xl border border-slate-300 px-4 py-3 outline-none " +
    "transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";

function ProductForm({ editingProduct, onSubmit, onCancel }) {
    const [form, setForm] = useState(
        editingProduct
            ? {
                  name: editingProduct.name || "",
                  price: editingProduct.price ?? "",
                  category: editingProduct.category || "",
                  description: editingProduct.description || "",
                  image: editingProduct.image || "",
              }
            : { ...emptyForm }
    );

    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving) return;

        const { name, price, category, description, image } = form;

        if (!name.trim() || price === "" || !image || !category.trim()) {
            setError("Name, price, category, and image are required.");
            return;
        }

        if (!Number.isFinite(Number(price)) || Number(price) < 0) {
            setError("Please enter a valid price.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const productData = {
                name: name.trim(),
                price: Number(price),
                category: category.trim(),
                description: description.trim(),
                image,
            };

            const success = await onSubmit(productData);

            if (success !== true) {
                setError(
                    "Product was not confirmed as saved. Please check the backend connection."
                );
                return;
            }

            setForm({ ...emptyForm });
            setError("");
        } catch (err) {
            console.error("Product Form Error:", err);
            setError(
                err.message || "Could not save the product. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:sticky lg:top-24"
        >
            <h2 className="text-xl font-bold text-slate-900">
                {editingProduct ? "Edit Product" : "Add Product"}
            </h2>

            <ImageUpload
                image={form.image}
                onChange={(image) => {
                    setForm((prev) => ({ ...prev, image }));
                    setError("");
                }}
                onError={setError}
            />

            <input
                name="name"
                type="text"
                placeholder="Product name"
                className={inputClass}
                value={form.name}
                onChange={handleChange}
                disabled={saving}
            />

            <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price (₱)"
                className={inputClass}
                value={form.price}
                onChange={handleChange}
                disabled={saving}
            />

            <input
                name="category"
                type="text"
                placeholder="Category (e.g. Electronics, Clothing)"
                className={inputClass}
                value={form.category}
                onChange={handleChange}
                disabled={saving}
            />

            <textarea
                name="description"
                rows="3"
                placeholder="Short description"
                className={inputClass}
                value={form.description}
                onChange={handleChange}
                disabled={saving}
            />

            {error && (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                    {saving
                        ? "Saving..."
                        : editingProduct
                        ? "Update"
                        : "Add Product"}
                </button>

                {editingProduct && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={saving}
                        className="flex-1 rounded-xl bg-slate-100 py-3 font-semibold text-slate-700 transition hover:bg-slate-200"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}

export default ProductForm;
