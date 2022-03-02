export interface ICodeHighlight
{
    begin: string;
    highlight: string
    end: string;
    lineNumber: number;
}

export interface ISarifGeneralStatistics
{
    [name: string]: number;
}