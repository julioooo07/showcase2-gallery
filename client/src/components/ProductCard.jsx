
function ProductCard({
    product,
    showActions = false,
    onEdit,
    onDelete,
    onClick,
}) {
    const openDetails = () => {
        if (onClick) onClick(product);
    };

    return (
        <article
            className={`group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                onClick ? "cursor-pointer" : ""
            }`}
        >
            <div
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
                onClick={openDetails}
                onKeyDown={(event) => {
                    if (
                        onClick &&
                        (event.key === "Enter" || event.key === " ")
                    ) {
                        event.preventDefault();
                        openDetails();
                    }
                }}
            >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />

                    <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-bold text-indigo-600 shadow">
                        ₱{Number(product.price).toLocaleString()}
                    </div>
                </div>

                <div className="p-5">
                    <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        {product.category || "Uncategorized"}
                    </span>

                    <h3 className="mt-3 text-lg font-semibold text-slate-900">
                        {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                        {product.description || "No description available."}
                    </p>
                </div>
            </div>

            {showActions && (
                <div className="flex gap-2 px-5 pb-5">
                    <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(product._id)}
                        className="flex-1 rounded-lg bg-red-500 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                        Delete
                    </button>
                </div>
            )}
        </article>
    );
}

export default ProductCard;
