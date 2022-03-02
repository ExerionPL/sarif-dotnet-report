import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';

let data = {"$schema":"https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.5.json","version":"2.1.0","runs":[{"results":[{"ruleId":"SCS0005","ruleIndex":0,"level":"note","message":{"text":"Weak random number generator."},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"file:///C:/Projects/aida/AidaBlood-BE/Aida.Blood.Domain.Platelets.Tests/Import/Map/DefaultImportFileMapTests.cs"},"region":{"startLine":88,"startColumn":21,"endLine":88,"endColumn":32},"code":{"startLine":86,"text":"                return Math.Min(\r\n                    (decimal)stop,\r\n                    random.Next(start, stop) + (random.Next(0, 1) / random.Next(1, 2)));\r\n            }\r\n        }\r\n","endLine":90}}}],"properties":{"warningLevel":1}},{"ruleId":"SCS0005","ruleIndex":0,"level":"warning","message":{"text":"Weak random number generator."},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"file:///C:/Projects/aida/AidaBlood-BE/Aida.Blood.Domain.Platelets.Tests/Import/Map/DefaultImportFileMapTests2.cs"},"region":{"startLine":88,"startColumn":21,"endLine":88,"endColumn":32},"code":{"startLine":86,"text":"                return Math.Min(\r\n                    (decimal)stop,\r\n                    random.Next(start, stop) + (random.Next(0, 1) / random.Next(1, 2)));\r\n            }\r\n        }\r\n","endLine":90}}}],"properties":{"warningLevel":1}},{"ruleId":"SCS0005","ruleIndex":0,"level":"warning","message":{"text":"Weak random number generator."},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"file:///C:/Projects/aida/AidaBlood-BE/Aida.Blood.Domain.Platelets.Tests/Import/Map/DefaultImportFileMapTests2.cs"},"region":{"startLine":88,"startColumn":49,"endLine":88,"endColumn":60},"code":{"startLine":86,"text":"                return Math.Min(\r\n                    (decimal)stop,\r\n                    random.Next(start, stop) + (random.Next(0, 1) / random.Next(1, 2)));\r\n            }\r\n        }\r\n","endLine":90}}}],"properties":{"warningLevel":1}},{"ruleId":"SCS0005","ruleIndex":0,"level":"error","message":{"text":"Weak random number generator."},"locations":[{"physicalLocation":{"artifactLocation":{"uri":"file:///C:/Projects/aida/AidaBlood-BE/Aida.Blood.Domain.Platelets.Tests/Import/Map/DefaultImportFileMapTests.cs"},"region":{"startLine":88,"startColumn":69,"endLine":88,"endColumn":80},"code":{"startLine":86,"text":"                return Math.Min(\r\n                    (decimal)stop,\r\n                    random.Next(start, stop) + (random.Next(0, 1) / random.Next(1, 2)));\r\n            }\r\n        }\r\n","endLine":90}}}],"properties":{"warningLevel":1}}],"tool":{"driver":{"name":"Security Code Scan","version":"5.6.0","dottedQuadFileVersion":"5.6.0.0","semanticVersion":"5.6.0","language":"pl-PL","rules":[{"id":"SCS0005","shortDescription":{"text":"Weak random number generator."},"fullDescription":{"text":"It is possible to predict the next numbers of a pseudo random generator. Use a cryptographically strong generator for security sensitive purposes."},"helpUri":"https://security-code-scan.github.io/#SCS0005","properties":{"category":"Security"}}]}},"columnKind":"utf16CodeUnits"}]};

ReactDOM.render(
  <React.StrictMode>
    <App data={data} title="Aida Blood" />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
