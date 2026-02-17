import { useParams } from "react-router-dom";

const TestPage = () => {
  const params = useParams();
  
  return (
    <div className="p-8 bg-white">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {JSON.stringify(params, null, 2)}
      </pre>
    </div>
  );
};

export default TestPage;