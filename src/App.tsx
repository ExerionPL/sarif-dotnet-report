import React from 'react';
import './App.scss';
import { ISarifData, ISarifReportData } from './SarifSchema';
import SarifStatistics from './components/SarifStatistics';
import SarifRuns from './components/SarifRuns';

export default function App(props: ISarifReportData)
{
    let data: ISarifData = props.data || ({} as ISarifData);

    return (
        <div className="app">
            <header className="app__header">
                <div className="header__title"><span className="header__title-small">{props.title}</span>SARIF Report</div>
                <div className="header__version">schema version: <span className="header__version-value">{data.version}</span></div>
            </header>
            <main>
                <div className="statistics">
                    <SarifStatistics {...data} />
                </div>
                <div className="results">
                    <SarifRuns {...data} />
                </div>
            </main>
        </div>
    );
}