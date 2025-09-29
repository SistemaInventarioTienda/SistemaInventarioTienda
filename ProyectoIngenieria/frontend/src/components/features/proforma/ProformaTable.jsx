export default function ProformaTable({ items }) {
    return (
        <div className="proforma-table-container">
            <table className="proforma-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Impuesto</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item, idx) => {
                        const sub = item.PRECIO_UNITARIO * item.CANTIDAD

                        // descuento en %
                        const descPct = item.DESCUENTO || 0
                        const desc = (descPct * sub) / 100
                        const subDesc = sub - desc

                        // impuesto en %
                        const impPct = item.IMPUESTO || 0
                        const imp = (impPct * subDesc) / 100

                        const total = subDesc + imp

                        return (
                            <tr key={idx}>
                                <td>{item.DSC_NOMBRE}</td>
                                <td>₡{item.PRECIO_UNITARIO.toLocaleString("es-CR")}</td>
                                <td>{item.CANTIDAD}</td>
                                <td>₡{subDesc.toLocaleString("es-CR")}</td>
                                <td>{impPct}% (₡{imp.toLocaleString("es-CR")})</td>
                                <td>₡{total.toLocaleString("es-CR")}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
