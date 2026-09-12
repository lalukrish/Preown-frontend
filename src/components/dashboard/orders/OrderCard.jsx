import logo from "@/assets/newlogo.png";

const STRAPI_BASE = "https://backapp.preown.store";

// product_image_url comes back as an array of relative paths — use the first
function getItemImage(item) {
  const path = Array.isArray(item.product_image_url)
    ? item.product_image_url[0]
    : item.product_image_url;
  if (!path) return "/phone1.png";
  return path.startsWith("http") ? path : `${STRAPI_BASE}${path}`;
}

const statusColor = {
  Delivered: "bg-green-100 text-green-600",
  Shipped: "bg-blue-100 text-blue-600",
  Confirmed: "bg-cyan-100 text-cyan-700",
  Processing: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-500",
};

export default function OrderCard({
  id,
  date,
  status,
  amount,
  items = [],
  subtotal,
  discount,
  shippingFee,
  paymentMethod,
  orderNumber,
  advanceAmount,
  remainingAmount,
  paymentStatus,
  codConfirmed,
}) {
  const firstItem = items[0];
  const extraCount = items.length > 1 ? items.length - 1 : 0;
  const thumbnails = items.slice(0, 3);
  const isCod = paymentMethod === "cod";

  const paymentMethodLabel = isCod
    ? "Cash on Delivery"
    : paymentMethod
      ? "Online Payment"
      : "-";

  const handleDownloadInvoice = () => {
    const win = window.open("", "_blank");
    if (!win) return;

    // every product in this order, its own line — shop warranty, product
    // warranty, serial number only printed when that item actually has one
    const rows = items
      .map((it) => {
        const extraLines = [
          it.shop_warrenty ? `Shop Warranty: ${it.shop_warrenty} days` : null,
          it.prodcut_warrenty
            ? `Product Warranty until: ${new Date(it.prodcut_warrenty).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
            : null,
          it.SerialNumber ? `Serial: ${it.SerialNumber}` : null,
        ].filter(Boolean);

        return `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">
              ${it.product_name}
              ${
                extraLines.length
                  ? `<br/><span style="color:#999;font-size:11px;">${extraLines.join(" · ")}</span>`
                  : ""
              }
            </td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₹${Number(it.price || 0).toLocaleString("en-IN")}</td>
          </tr>`;
      })
      .join("");

    // advance/remaining are order-level, not per item — show as their own
    // total rows; label the remaining row differently for COD vs online
    const advanceRow =
      advanceAmount != null
        ? `<tr><td class="label">Advance Paid</td><td style="text-align:right;">₹${Number(advanceAmount).toLocaleString("en-IN")}</td></tr>`
        : "";
    const remainingRow =
      remainingAmount != null
        ? `<tr><td class="label">${isCod ? "Payable on Delivery" : "Balance Due"}</td><td style="text-align:right;">₹${Number(remainingAmount).toLocaleString("en-IN")}</td></tr>`
        : "";

    win.document.write(`
      <html>
        <head>
          <title>Invoice ${orderNumber || id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #222; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            .totals { width: 280px; margin-left: auto; margin-top: 20px; }
            .totals td { padding: 6px 8px; }
            .totals .label { color: #666; }
          </style>
        </head>
        <body>
          <img src="${logo.src}" alt="PreOwn" style="height:40px;margin-bottom:16px;" />
          <h1>Invoice</h1>
          <p>Order ${orderNumber || id} · ${date}</p>
          <table>
            <thead>
              <tr>
                <th style="text-align:left;padding:8px;border-bottom:2px solid #222;">Item</th>
                <th style="text-align:right;padding:8px;border-bottom:2px solid #222;">Price</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <table class="totals">
            <tr><td class="label">Subtotal</td><td style="text-align:right;">₹${Number(subtotal || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td class="label">Discount</td><td style="text-align:right;">-₹${Number(discount || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td class="label">Shipping</td><td style="text-align:right;">₹${Number(shippingFee || 0).toLocaleString("en-IN")}</td></tr>
            <tr><td class="label"><strong>Total</strong></td><td style="text-align:right;"><strong>${amount}</strong></td></tr>
            ${advanceRow}
            ${remainingRow}
          </table>
          <p style="margin-top:24px;color:#888;font-size:12px;">
            Payment method: ${paymentMethodLabel}${paymentStatus ? ` (${paymentStatus})` : ""}
            ${isCod && codConfirmed === false ? "<br/>COD not yet confirmed" : ""}
          </p>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-4">
        {/* stacked thumbnails — one order, up to 3 product previews overlapping */}
        <div className="flex items-center flex-shrink-0" style={{ width: 64 }}>
          {thumbnails.map((it, i) => (
            <img
              key={it.id ?? i}
              src={getItemImage(it)}
              alt={it.product_name}
              className="w-12 h-12 rounded-lg object-cover border-2 border-white bg-gray-50"
              style={{
                marginLeft: i === 0 ? 0 : -20,
                zIndex: thumbnails.length - i,
              }}
            />
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {firstItem?.product_name || "—"}
            {extraCount > 0 && (
              <span className="text-xs font-normal text-gray-400">
                {" "}
                +{extraCount} more
              </span>
            )}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {orderNumber || id} · {date}
          </p>
          <span
            className={`inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full ${statusColor[status] || "bg-gray-100 text-gray-500"}`}
          >
            {status}
          </span>

          {/* order-level payment info — same for every item in this group */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
            <span>{paymentMethodLabel}</span>
            {advanceAmount != null && (
              <span>
                Advance paid:{" "}
                <span className="text-gray-700 font-medium">
                  ₹{Number(advanceAmount).toLocaleString("en-IN")}
                </span>
              </span>
            )}
            {remainingAmount != null && (
              <span>
                {isCod ? "Payable on delivery" : "Balance due"}:{" "}
                <span className="text-gray-700 font-medium">
                  ₹{Number(remainingAmount).toLocaleString("en-IN")}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-sm font-bold text-gray-800">{amount}</p>
          <button
            onClick={handleDownloadInvoice}
            className="mt-2 text-xs text-cyan-800 font-medium hover:underline cursor-pointer"
          >
            Download Invoice
          </button>
        </div>
      </div>

      {/* full item list inside the box — basic per-product detail, no separate invoice needed to see what's in here */}
      {items.length > 1 && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
          {items.map((it, i) => (
            <div
              key={it.id ?? i}
              className="flex items-center justify-between text-xs text-gray-500"
            >
              <span className="truncate">{it.product_name}</span>
              <span className="text-gray-700 font-medium flex-shrink-0 ml-2">
                ₹{Number(it.price || 0).toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
