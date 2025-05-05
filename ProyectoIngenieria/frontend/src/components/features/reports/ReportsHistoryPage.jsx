import { EntityPage } from "../../../pages/EntityPage";
import { reportConfig } from "../../../config/entities/reportConfig";
import { default as ReportForm } from "../../../pages/pagesForms/ReportForm";

function ReportsHistoryPage() {

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
    } = reportConfig;

    return (
        <EntityPage
            entityName={entityName}
            modalComponent={ReportForm}
            titlePage={titlePage}
            entityMessage={entityMessage}
            columns={columns}
            fields={fields}
            fetchAll={api.fetchAll}
            searchByName={api.searchByName}
            entityKey={entityKey}
            transformData={transformData.toFrontend}
            transformConfig={transformConfig}
            actions={{ ...actions, downloadHandler: actions.downloadHandler }}
        />
    )
}

export default ReportsHistoryPage;