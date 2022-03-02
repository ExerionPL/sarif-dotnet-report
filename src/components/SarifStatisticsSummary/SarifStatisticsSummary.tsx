import React from "react";
import './SarifStatisticsSummary.scss';
import { isSelected, hasActiveFilters } from "../../common/functions";
import { ISarifFilters } from "../../services/filtering";
import { ISarifGeneralStatistics } from "../../common/types";

export default function SarifStatisticsSummary(props: {
    title: string,
    filters: ISarifFilters,
    statistics: ISarifGeneralStatistics,
    category: keyof ISarifFilters,
    createFilter: (f: ISarifFilters, c: keyof ISarifFilters, v: string) => (_: any) => void,
    createTooltip?: (v: string) => string,
    createLabel?: (v: string) => string})
{
    function getSelectedClass(filters: ISarifFilters, type: keyof ISarifFilters, filter: string): string | undefined
    {
        return isSelected(filters, type, filter) ? "selected" : undefined;
    }

    function getActiveFiltersClass(filters: ISarifFilters, type: keyof ISarifFilters): string | undefined
    {
        return hasActiveFilters(filters, type) ? "active-filters" : undefined;
    }

    let {title, filters, statistics, category, createFilter, createTooltip, createLabel} = props;
    
    const keys = Object.keys(statistics);
    return (
        <div className="sarif-statistics">
            <div className="sarif-statistics__header">{title}:</div>
            <table className={getActiveFiltersClass(filters, category)}>
                <tbody>
                    {keys.length == 0
                    ? <tr>
                          <td style={{textAlign: "center"}}>No data</td>
                      </tr>
                    : keys.sort().map((key, index) => 
                    <tr key={"statistics-category" + index} className={getSelectedClass(filters, category, key)} onClick={createFilter(filters, category, key)}>
                        <td className="sarif-statistics__category-label" title={createTooltip ? createTooltip(key) : key}>{createLabel ? createLabel(key) : key}</td>
                        <td className="sarif-statistics__category-value">{statistics[key]}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>);
}