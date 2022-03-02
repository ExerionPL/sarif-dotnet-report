import React, { useEffect, useState } from 'react';
import './SarifRun.scss';
import { ISarifRun } from "../../SarifSchema";
import SarifResult from '../SarifResult';
import filterService, { ISarifFilters } from '../../services/filtering';
import { isNotEmpty, matchesFilter } from '../../common/functions';

export default function SarifRun(props: ISarifRun)
{
    const driver = props.tool.driver;
    const results = props.results;

    let [filters, setFilters] = useState({} as ISarifFilters);
    useEffect(() => {
        const sub = filterService.subscribe(setFilters);
        return () => sub.unsubscribe();
    });

    return (<div className="sarif-run">
        <div className="sarif-run__driver">
            <div className="driver">
                <div className="driver__name"><span className="driver__name-label">Driver:</span>{driver.name}</div>
                <div className="driver__version">v.{driver.version}</div>
            </div>
        </div>
        <div className="sarif-run__results">
            {results.length > 0
                ? results.filter(r => matchesFilter(filters, driver.rules, r)).map((result, index) => <SarifResult key={"result-" + index} data={result} rules={driver.rules} />)
                : <div>No defects reported</div>}
        </div>
    </div>);
}
