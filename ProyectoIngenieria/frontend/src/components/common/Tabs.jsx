import React from "react"

export const TabList = ({ children, className }) => {
    return (
        <div className={`tab-list ${className || ""}`} role="tablist">
            {children}
        </div>
    )
}

export const Tab = ({ children, value, active, onClick }) => {
    return (
        <button
            role="tab"
            aria-selected={active}
            aria-controls={`panel-${value}`}
            id={`tab-${value}`}
            onClick={onClick}
            className={active ? "tab-active" : ""}
        >
            {children}
        </button>
    )
}

export const TabPanel = ({ children, value, active }) => {
    if (!active) return null

    return (
        <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} className="tab-panel">
            {children}
        </div>
    )
}

export const Tabs = ({ children, activeTab, onChange, className }) => {
    const processedChildren = React.Children.map(children, (child) => {
        if (child.type === TabList) {
            const tabListChildren = React.Children.map(child.props.children, (tab) => {
                if (tab.type === Tab) {
                    return React.cloneElement(tab, {
                        active: tab.props.value === activeTab,
                        onClick: () => onChange(tab.props.value),
                    })
                }
                return tab
            })

            return React.cloneElement(child, {}, tabListChildren)
        }
        return child
    })

    return <div className={`tabs ${className || ""}`}>{processedChildren}</div>
}
