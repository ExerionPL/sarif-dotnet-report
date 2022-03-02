import { ISarifCodeSnippet, ISarifDriverRule, ISarifRegion, ISarifResult, ISarifRun } from "../SarifSchema";
import { ISarifFilters } from "../services/filtering";
import { ICodeHighlight, ISarifGeneralStatistics } from "./types";

export function extractFileData(uri: string): string[]
{
    let file = uri.substring(8);
    var lastSeparatorIndex = 1 + file.lastIndexOf("/");
    return [file.substring(0, lastSeparatorIndex), file.substring(lastSeparatorIndex)];
}

export function isNotEmpty<T>(arr: T[] | undefined): boolean
{
    return arr != undefined && arr != null && arr.length > 0;
}

export function buildTitle(region: ISarifRegion, namespace: string, file: string): string
{
    if (region.startLine == region.endLine)
        return `${namespace}${file} ${region.startLine}:${region.startColumn}-${region.endColumn}`;

    return `${namespace}${file} ${region.startLine}:${region.startColumn} - ${region.endLine}:${region.endColumn}`;
}

export function buildCodeHighlights(region: ISarifRegion, codeSnippet: ISarifCodeSnippet): ICodeHighlight[]
{
    const splitter = "\r\n";
    let code = codeSnippet.text;
    if (code.endsWith(splitter))
        code = code.substring(0, code.length - splitter.length);

    let lines = code.split(splitter);
    let lineCounter = codeSnippet.startLine;
    const startLineIndex = region.startLine - codeSnippet.startLine;
    const endLineIndex = region.endLine - codeSnippet.startLine;

    return lines.map((line, lineIndex) => {
        const result:ICodeHighlight = {begin:"", highlight: "", end: "", lineNumber: lineCounter++};
        let l = line;
        if (lineIndex == endLineIndex)
        {
            const stop = region.endColumn - 1;
            result.end = l.substring(stop);
            l = l.substring(0, stop);
        }

        if (lineIndex == startLineIndex)
        {
            const stop = region.startColumn - 1;
            result.begin = l.substring(0, stop);
            l = l.substring(stop);
        }

        if (lineIndex < startLineIndex)
            result.begin = l;
        else if (lineIndex > endLineIndex)
            result.begin = l;
        else
            result.highlight = l;
        
        result.end += splitter;

        return result;
    });
}

export function getFileName(uri: string): string
{
    return uri.substring(uri.lastIndexOf("/") + 1);
}

export function incrementCounter(target: ISarifGeneralStatistics, key: string, byValue: number | undefined = undefined): void
{
    if (target[key] == undefined)
        target[key] = 0;
        
    target[key] += byValue == undefined ? 1 : byValue;
}

export function getRuleDescription(data: ISarifRun[], ruleId: string): string | undefined
{
    for (let i = 0; i < data.length; ++i)
    {
        const rules = data[i].tool.driver.rules;
        if (rules == undefined)
            continue;
    
        var rule = rules.find(_ => _.id == ruleId);
        if (rule != undefined)
            return rule.shortDescription.text;
    }

    return undefined;
}

export function toggleFilter(filters: ISarifFilters, type: keyof ISarifFilters, value: string): void
{
    const filterValues: string[] = filters[type];

    const index = filterValues.indexOf(value);
    if (index > -1)
        filterValues.splice(index, 1);
    else
        filterValues.push(value);
}

export function hasActiveFilters(filters: ISarifFilters, type: keyof ISarifFilters): boolean
{
    return isNotEmpty(filters[type]);
}

export function isSelected(filters: ISarifFilters, type: keyof ISarifFilters, filter: string): boolean
{
    return filters[type].includes(filter);
}

export function matchesFilter(filters: ISarifFilters, rules: ISarifDriverRule[] | undefined, r: ISarifResult): boolean
{
    if (isNotEmpty(filters.level))
        if (!filters.level.includes(r.level))
            return false;

    if (isNotEmpty(filters.category) && isNotEmpty(rules))
    {
        const rule = (rules as ISarifDriverRule[])[r.ruleIndex];
        if (!filters.category.includes(rule.properties.category))
            return false;
    }

    if (isNotEmpty(filters.rule))
    {
        if (!filters.rule.includes(r.ruleId))
            return false;
    }

    if (isNotEmpty(filters.file))
    {
        if (r.locations.filter(l => filters.file.includes(l.physicalLocation.artifactLocation.uri)).length == 0)
            return false;
    }

    return true;
}