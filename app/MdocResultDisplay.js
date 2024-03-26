import React from 'react';
import './MdocResultDisplay.css';

function MdocResultDisplay({ mdocResult, encodedString }) {
  let result;
  try {
    result = typeof mdocResult === 'string' ? JSON.parse(mdocResult) : mdocResult;
  } catch (error) {
    console.error('解析 mdocResult 出错:', error);
    return <div>解析錯誤</div>;
  }
  // 將 encodedString 從 Base64 解碼為二進制字符串
  let decodedString = '';
  if (encodedString) {
    decodedString = atob(encodedString);
  }

  const documents = result.serialized_mdoc.documents;

  return (
    <div className="mdoc-container">
      <h2 className="text-xl font-bold mb-2">Mdoc 結果</h2>
      {documents.map((doc, index) => (
        <div key={index} className="mdoc-document">
          <h3>[文檔類型]: {doc.docType}</h3>
          <div className="mdoc-section">發布者簽名: <span className="mdoc-data">{doc.issuerSigned.issuerAuth}</span></div>
          <div>
            <h4>命名空間:</h4>
            {Object.entries(doc.issuerSigned.nameSpaces).map(([namespace, elements], nsIndex) => (
              <div key={nsIndex} className="mdoc-namespace">
                <h5>{namespace}</h5>
                {elements.map((element, elIndex) => (
                  <div key={elIndex} className="mdoc-element">
                    {Object.entries(element).map(([key, value]) => (
                      <div key={key} className="mdoc-field">
                        <strong>{value.elementIdentifier}:</strong> <span className="mdoc-data">{value.elementValue}</span>
                        <br />
                        <strong>隨機數:</strong> <span className="mdoc-data">{value.random}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
          
        </div>
      ))}
      {/* 顯示解碼後的2進位數據 */}
      {decodedString && (
        <div className="mt-4 w-full">
          <h2 className="text-xl font-bold mb-2">AF Binary string representation</h2>
          <textarea className="w-full p-2 border rounded" value={decodedString} readOnly />
        </div>
      )}
    </div>
  );
}

export default MdocResultDisplay;