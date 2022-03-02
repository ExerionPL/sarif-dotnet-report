import React, { useState } from "react";
import { ISarifData } from "../../SarifSchema";
import filterService, { ISarifFilters } from '../../services/filtering';
import { ISarifGeneralStatistics } from "../../common/types";
import { toggleFilter, incrementCounter, getFileName, matchesFilter } from "../../common/functions";
import SarifStatisticsSummary from "../SarifStatisticsSummary";

export default function SarifStatistics(props: ISarifData)
{
    let issuesPerLevel: ISarifGeneralStatistics = {};
    let issuesPerDriver: ISarifGeneralStatistics = {};
    let issuesPerFile: ISarifGeneralStatistics = {};
    let issuesPerRule: ISarifGeneralStatistics = {};
    let issuesPerCategory: ISarifGeneralStatistics = {};

    let [listOfFilters, setFilters] = useState<ISarifFilters>({
        category: [],
        driver: [],
        file: [],
        level: [],
        rule: []
    });

    function createFilter(filters: ISarifFilters, key: keyof ISarifFilters, value: string)
    {
        return (_: any) => {
            toggleFilter(filters, key, value);
            filterService.dispatch(filters);
            setFilters({...filters});
        };
    }

    props.runs
        .map(run => {
            const result = {...run};
            result.results = run.results.filter(result => matchesFilter(listOfFilters, run.tool.driver.rules, result));
            return result;
        })
        .filter(run => run.results.length > 0)
        .forEach(run => {
        const driver = run.tool.driver;
        incrementCounter(issuesPerDriver, driver.name, run.results.length);

        run.results.forEach(result => {
            incrementCounter(issuesPerLevel, result.level);
            incrementCounter(issuesPerRule, result.ruleId);
            if (driver.rules != undefined)
            {
                const rule = driver.rules[result.ruleIndex];
                incrementCounter(issuesPerCategory, rule.properties.category);
            }

            result.locations.forEach(location => {
                const uri = location.physicalLocation.artifactLocation.uri;
                incrementCounter(issuesPerFile, uri);
            });
        });
    });

    return (<div>
        <SarifStatisticsSummary
            title="Issues per level"
            filters={listOfFilters}
            statistics={issuesPerLevel}
            category="level"
            createFilter={createFilter} />

        <SarifStatisticsSummary
            title="Issues per driver"
            filters={listOfFilters}
            statistics={issuesPerDriver}
            category="driver"
            createFilter={createFilter} />

        <SarifStatisticsSummary
            title="Issues per file"
            filters={listOfFilters}
            statistics={issuesPerFile}
            category="file"
            createFilter={createFilter}
            createLabel={getFileName} />

        <SarifStatisticsSummary
            title="Issues per rule"
            filters={listOfFilters}
            statistics={issuesPerRule}
            category="rule"
            createFilter={createFilter} />
        
        <SarifStatisticsSummary
            title="Issues per category"
            filters={listOfFilters}
            statistics={issuesPerCategory}
            category="category"
            createFilter={createFilter} />
    </div>);
}