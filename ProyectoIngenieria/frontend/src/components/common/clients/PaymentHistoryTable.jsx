import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "../Button";
import { Table } from "../../common"; //
import { SquarePen } from "lucide-react";
import { ModalComponent } from "../../modals";
import PaymentForm from "../../../pages/pagesForms/PaymentForm";
import handleApiCall from "../../../utils/handleApiCall";

const PaymentHistoryTable = ({ payments, creditConfig, fetchCreditData, pendingAmount }) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("edit");
  const [modalData, setModalData] = useState(null);

  const {
    fields,
    transformData,
    api,
  } = creditConfig;
  //console.log("Payments recibidos: ", payments);
  const handleEdit = (rowData) => {
    const updateRowData = {
      ...rowData,
      MON_PENDIENTE: pendingAmount,
    };

    setModalMode("edit");
    setModalOpen(true);
    setModalData(updateRowData); 
    console.log("Datos iniciales para el form: ", modalData);
  };

  const onSubmit = async (data) => {
    try {
      console.log("Data recibida en onSubmit: ", data);
      if (!data || typeof data !== "object") {
        throw new Error("Los datos recibidos en onSubmit son inválidos.");
      }

      if (!data.MON_ABONADO || !data.ID_ABONO) {
        throw new Error("Faltan campos obligatorios (MON_ABONADO o ID_CREDITO).");
      }
      const backendData = await transformData.toBackend(data);
      console.log("backendData", backendData);

      const idAbono = backendData.ID_ABONO;
      console.log("ID_ABONO: ", idAbono);
      await handleApiCall(
        () => api.update(idAbono, backendData),
        "Abono actualizado exitosamente."
      );

      await fetchCreditData(); // Actualizar los datos del crédito después de la operación
    
      setModalOpen(false); // Cerrar el modal después de la operación
      return { success: true };
    } catch (error) {
      console.error("Error desde PaymentHistoryTable: ", error.message);
          return { success: false };
    }
  };

  const ActionButton = ({ onClick, color, children }) => (
    <Button
      className="btn me-3 p-0"
      style={{
        backgroundColor: color,
        borderRadius: "16px",
        width: "40px",
        height: "40px",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );

  return (
    <div className="credits-card" style={{ marginTop: "1.5rem" }}>
      <div className="credits-card-header">
        <h2 className="credits-card-title">Historial de Pagos</h2>
        <p className="credits-card-description">
          Registro de pagos realizados para este crédito
        </p>
      </div>
      <div className="credits-content">
        <Table
          columns={[
            { label: "Fecha", field: "date" },
            { label: "Monto", field: "amount" },
            { label: "Acción", field: "action" },
          ]}
          data={payments.map((payment, index) => ({
            id: payment.id,
            date: payment.date,
            amount: `₡${payment.amount.toLocaleString()}`,

            action: 
            (
              <div className="action-cell">
                <ActionButton
                  onClick={() => handleEdit(payment)}
                  color="#007AFF"
                >
                  <SquarePen size={20} color="#FFFFFF" />
                </ActionButton>
              </div>
            ),
          }))}
          //actions={{edit: handleEdit}}
        />
      </div>
      <ModalComponent
      isOpen={isModalOpen}
      title={`Editar Abono`}
      onClose={() => setModalOpen(false)}
      entityName= {"Abono"}
      mode={modalMode}
      >
        <PaymentForm
          fields={fields}
          initialData={modalData}
          onSubmit={onSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </ModalComponent>
        
    

    
    </div>
  );
};

export default PaymentHistoryTable;
// {
//   /* () => actions.edit(rowData) */
// }
