import React from "react";

const CaseDetails = ({ result, success }) => {
  if (!success || !result) {
    return <p>No case details available.</p>;
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "case_details.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handlePrint = () => {
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.open();
    printWindow.document.write(
      "<html><head><title>Case Details</title></head><body><pre>" +
        result +
        "</pre></body></html>"
    );
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Case Details</h2>

      <div className="mb-4">
        <pre className="whitespace-pre-wrap break-words">{result}</pre>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleDownload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Download
        </button>
        <button
          onClick={handlePrint}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Print
        </button>
      </div>
    </div>
  );
};

export default CaseDetails;
