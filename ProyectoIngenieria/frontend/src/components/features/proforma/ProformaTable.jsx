export default function ProformaTable({ items }) {
    return (
        <div className="proforma-table-container">
            <table className="proforma-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Descuento</th>
                        <th>Subtotal</th>
                        <th>Impuesto</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {items?.map((item, idx) => {
                        const sub = item.PRECIO_UNITARIO * item.CANTIDAD
                        const desc = ((item.DESCUENTO || 0) * sub) / 100
                        const subDesc = sub - desc
                        const imp = Math.round(subDesc * 0.13)
                        const total = subDesc + imp

                        return (
                            <tr key={idx}>
                                <td>{item.Product.DSC_NOMBRE}</td>
                                <td>₡{item.PRECIO_UNITARIO.toLocaleString()}</td>
                                <td>{item.CANTIDAD}</td>
                                <td>{item.DESCUENTO || 0}%</td>
                                <td>₡{subDesc.toLocaleString()}</td>
                                <td>₡{imp.toLocaleString()}</td>
                                <td>₡{total.toLocaleString()}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}