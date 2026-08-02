import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Employee Dashboard</h1>

        <div className="space-y-4">
          <Link
            to="/employee/create"
            className="block w-full bg-gray-900 text-white text-center rounded py-3 font-medium hover:bg-gray-800"
          >
            Create New Voucher
          </Link>
          <Link
            to="/employee/vouchers"
            className="block w-full bg-white border border-gray-300 text-gray-900 text-center rounded py-3 font-medium hover:bg-gray-50"
          >
            My Vouchers
          </Link>
        </div>
      </div>
    </div>
  );
}
