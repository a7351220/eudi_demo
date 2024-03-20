"use client"
import { useState } from 'react';
import MdocResultDisplay from './MdocResultDisplay';

export default function Home() {
  const [familyName, setFamilyName] = useState('');
  const [givenName, setGivenName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthCountry, setBirthCountry] = useState('');
  const [taxIdCode, setTaxIdCode] = useState('');
  const [mdocResult, setMdocResult] = useState('');
  const generateRandomData = () => {
    const randomFamilyName = ['楊', '李', '王'][Math.floor(Math.random() * 3)];
    const randomGivenName = ['小明', '小莫', '小金'][Math.floor(Math.random() * 3)];
    const randomBirthDate = `199${Math.floor(Math.random() * 10)}-0${Math.floor(Math.random() * 9) + 1}-0${Math.floor(Math.random() * 9) + 1}`;
    const randomBirthPlace = ['彰化', '新北', '花蓮'][Math.floor(Math.random() * 3)];
    const randomBirthCountry = '台灣';
    const randomTaxIdCode = `TINIT-${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;

    // 更新狀態變量
    setFamilyName(randomFamilyName);
    setGivenName(randomGivenName);
    setBirthDate(randomBirthDate);
    setBirthPlace(randomBirthPlace);
    setBirthCountry(randomBirthCountry);
    setTaxIdCode(randomTaxIdCode);
  };
  // 處理表單提交事件
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表單默認提交行為

    // 準備要發送的數據
    const pidData = {
      "eu.europa.ec.eudiw.pid.1": {
        "family_name": familyName,
        "given_name": givenName,
        "birth_date": birthDate,
        "birth_place": birthPlace,
        "birth_country": birthCountry
      },
      "eu.europa.ec.eudiw.pid.it.1": {
        "tax_id_code": taxIdCode
      }
    };

    // 發送 POST 請求到 Flask API
    try {
      const response = await fetch('http://localhost:3000/api/generate_mdoc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pidData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMdocResult(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Failed to fetch mdoc:', error);
      setMdocResult('Failed to fetch mdoc');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">發行 MDOC CBOR</h1>
      <div className="flex w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="w-1/2 space-y-4 pr-4">
          <input
            type="text"
            value={familyName}
            onChange={(e) => setFamilyName(e.target.value)}
            placeholder="Family Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={givenName}
            onChange={(e) => setGivenName(e.target.value)}
            placeholder="Given Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="Birth Date"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={birthPlace}
            onChange={(e) => setBirthPlace(e.target.value)}
            placeholder="Birth Place"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={birthCountry}
            onChange={(e) => setBirthCountry(e.target.value)}
            placeholder="Birth Country"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={taxIdCode}
            onChange={(e) => setTaxIdCode(e.target.value)}
            placeholder="Tax ID Code"
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-start space-x-4">
            <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
              生成 Mdoc
            </button>
            <button type="button" onClick={generateRandomData} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
              隨機數據
            </button>
          </div>
        </form>

         {mdocResult && (
          <MdocResultDisplay mdocResult={mdocResult} />
        )}
        
      </div>
    </main>
  );
}