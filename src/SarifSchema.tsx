export interface ISarifUriContainer
{
  uri: string;
}

export interface ISarifWarningLevelContainer
{
  warningLevel: number;
}

export interface ISarifTextContainer
{
  text: string
}

export interface ISarifCategoryContainer
{
  category: string;
}

export interface ISarifRegion
{
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

export interface ISarifCodeSnippet
{
    text: string;
    startLine: number;
    endLine: number;
}

export interface ISarifPhysicalLocation
{
  artifactLocation: ISarifUriContainer;
  region: ISarifRegion;
  code: ISarifCodeSnippet;
}

export interface ISarifLocation
{
  physicalLocation: ISarifPhysicalLocation;
}

export interface ISarifResult
{
  ruleId: string;
  ruleIndex: number;
  level: string;
  message: ISarifTextContainer;
  locations: ISarifLocation[];
  properties: ISarifWarningLevelContainer
}

export interface ISarifDriverRule
{
  id: string;
  shortDescription: ISarifTextContainer;
  fullDescription: ISarifTextContainer;
  helpUri: string;
  properties: ISarifCategoryContainer;
}

export interface ISarifDriver
{
  name: string;
  version: string;
  dottedQuadFileVersion: string;
  semanticVersion: string;
  language: string;
  rules?: ISarifDriverRule[];
}

export interface ISarifTool
{
  driver: ISarifDriver;
}

export interface ISarifRun
{
  results: ISarifResult[];
  tool: ISarifTool;
  columnKind: string;
}

export interface ISarifData
{
  $schema: string;
  version: string;
  runs: ISarifRun[];
}

export interface ISarifReportData
{
  data?: ISarifData | null;
  title?: string | null;
}

export interface ISarifResultContainer
{
  data: ISarifResult;
  rules?: ISarifDriverRule[];
}