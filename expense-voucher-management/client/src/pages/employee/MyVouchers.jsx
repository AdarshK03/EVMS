import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getVouchers, deleteVoucher, submitVoucher } from '../../services/voucherService';

const STATUS_STYLES = {
  Draft: 'bg-gray-100 text-gray-700',
  Submitted: 'bg-blue-100 text-blue-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export default function MyVouchers() {
  const [vouchers, setVouchers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadVouchers() {
    setLoading(true);
    try {
      const result = await getVouchers();
      setVouchers(result.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vouchers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVouchers();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return;
    try {
      await deleteVoucher(id);
      setVouchers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete voucher');
    }
  }

  async function handleSubmit(id) {
    try {
      await submitVoucher(id);
      await loadVouchers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit voucher');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Vouchers</h1>
          <div className="flex gap-3">
            <Link
              to="/employee/create"
              className="bg-gray-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-gray-800"
            >
              Create New
            </Link>
            <Link
              to="/employee"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Back
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : vouchers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No vouchers found.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Voucher Number</th>
                  <th className="px-4 py-3 font-medium">Expense Title</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vouchers.map((v) => (
                  <tr key={v.id} className="text-gray-900">
                    <td className="px-4 py-3 font-mono text-xs">{v.voucher_number}</td>
                    <td className="px-4 py-3">{v.expense_title}</td>
                    <td className="px-4 py-3">{v.department}</td>
                    <td className="px-4 py-3">${Number(v.amount).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_STYLES[v.status] || ''}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(v.voucher_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link
                          to={`/employee/vouchers/${v.id}`}
                          className="text-gray-600 hover:text-gray-900 text-xs"
                        >
                          View
                        </Link>
                        {v.status === 'Draft' && (
                          <>
                            <Link
                              to={`/employee/vouchers/edit/${v.id}`}
                              className="text-gray-600 hover:text-gray-900 text-xs"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDelete(v.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => handleSubmit(v.id)}
                              className="text-blue-600 hover:text-blue-800 text-xs"
                            >
                              Submit
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
