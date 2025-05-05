import { EntityPage } from "../../../pages/EntityPage";
import { scheduledReportConfig } from "../../../config/entities/scheduledReportConfig";
import { default as ScheduledReportForm } from "../../../pages/pagesForms/ScheduledReportForm";

function ScheduledHistoryReportsPage() {

    const {
        entityName,
        titlePage,
        entityMessage,
        columns,
        fields,
        entityKey,
        api,
        transformData,
        transformConfig,
        actions,
    } = scheduledReportConfig;
    
    return (
        <EntityPage
            entityName={entityName}
            modalComponent={ScheduledReportForm}
            titlePage={titlePage}
            entityMessage={entityMessage}
            columns={columns}
            fields={fields}
            fetchAll={api.fetchAll}
            entityKey={entityKey}
            transformData={transformData.toFrontend}
            transformConfig={transformConfig}
            actions={actions}
        />
    )
}

export default ScheduledHistoryReportsPage;