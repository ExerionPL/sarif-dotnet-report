import React, { useEffect, useState } from 'react';
import './SarifResult.scss';
import { ISarifResultContainer } from '../../SarifSchema';
import filterService, { ISarifFilters } from '../../services/filtering';
import { ICodeHighlight } from '../../common/types';
import { buildCodeHighlights, buildTitle, extractFileData, isNotEmpty } from '../../common/functions';

export default function SarifResult(props: ISarifResultContainer)
{
    const data = props.data;
    const rule = !!props.rules
        ? props.rules[data.ruleIndex]
        : {
            id: "",
            helpUri: "",
            properties: {
                category: ""
            },
            shortDescription: {
                text: ""
            },
            fullDescription: {
                text: ""
            }
        };
    
    function mapCodeLine(line: ICodeHighlight, index: number)
    {
        if (!!line.highlight)
            return (
                <tr key={"line-" + index}>
                    <td className="sarif-result__location-code-line">{line.lineNumber}:</td>
                    <td className="sarif-result__location-code-content">{line.begin}<span className="sarif-result__location-code--highlight">{line.highlight}</span>{line.end}</td>
                </tr>);
        
        return (
            <tr key={"line-" + index}>
                <td className="sarif-result__location-code-line">{line.lineNumber}:</td>
                <td className="sarif-result__location-code-content">{line.begin}{line.highlight}{line.end}</td>
            </tr>)
    }

    let [filters, setFilters] = useState({} as ISarifFilters);
    useEffect(() => {
        const sub = filterService.subscribe(setFilters);
        return () => sub.unsubscribe();
    });

    let locations = data.locations;
    if (isNotEmpty(filters.file))
    {
        locations = locations.filter(l => filters.file.includes(l.physicalLocation.artifactLocation.uri));
    }

    return (
        <div className={"sarif-result sarif-result--" + props.data.level}>
            <div className="sarif-result__header">
                <div className="sarif-result__header-id"><a href={rule.helpUri} target={"_blank"}>{rule.id}</a></div>
                <div className="sarif-result__header-description">[{rule.properties.category}] {rule.shortDescription.text}</div>
            </div>
            <div className="sarif-result__header-explanation">{rule.fullDescription.text}</div>
            {locations.map((location, locationIndex) =>
            {
                const [namespace, file] = extractFileData(location.physicalLocation.artifactLocation.uri);
                
                return (
                <div key={"result-location-" + locationIndex} className="sarif-result__location">
                    <div className="sarif-result__location-file" title={buildTitle(location.physicalLocation.region, namespace, file)}>{file}:</div>
                    <div className="sarif-result__location-code">
                        <table>
                            <tbody>{buildCodeHighlights(location.physicalLocation.region, location.physicalLocation.code).map(mapCodeLine)}</tbody>
                        </table>
                    </div>
                </div>);
            })}
        </div>
    );
}