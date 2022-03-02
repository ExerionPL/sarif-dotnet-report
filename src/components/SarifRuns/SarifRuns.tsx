import React, { useEffect, useState } from 'react';
import { ISarifData } from '../../SarifSchema';
import filterService, { ISarifFilters } from '../../services/filtering';
import SarifRun from '../SarifRun';

export default function SarifRuns(props: ISarifData)
{
    let [filters, setFilters] = useState({} as ISarifFilters);
    useEffect(() => {
        const sub = filterService.subscribe(setFilters);
        return () => sub.unsubscribe();
    });

    let runs = props.runs;
    if (filters.driver != undefined && filters.driver.length > 0)
        runs = runs.filter(r => filters.driver.includes(r.tool.driver.name));

    return (<>{runs != undefined ? runs.map((run, index) => <SarifRun key={"run-" + index} {...run} />) : <div>No runs reported</div>}</>);
}