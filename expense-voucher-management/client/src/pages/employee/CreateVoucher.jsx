import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createVoucher, submitVoucher } from '../../services/voucherService';

const CATEGORIES = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Other'];

export default function CreateVoucher() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    voucher_date: today,
    expense_date: '',
    department: '',
    expense_title: '',
    expense_category: '',
    expense_description: '',
    amount: '',
    employee_signature: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSignature(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, employee_signature: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSaveDraft(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createVoucher(form);
      navigate('/employee/vouchers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create voucher');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.employee_signature) {
      setError('Employee signature is required before submitting');
      return;
    }

    setLoading(true);

    try {
      const result = await createVoucher(form);
      await submitVoucher(result.data.id);
      navigate('/employee/vouchers');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit voucher');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create Voucher</h1>
          <button
            onClick={() => navigate('/employee')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3">
            {error}
          </div>
        )}

        <form className="space-y-4 bg-white p-6 rounded shadow-sm">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Voucher Date
            </label>
            <input
              type="text"
              value={form.voucher_date}
              readOnly
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Date
            </label>
            <input
              type="date"
              name="expense_date"
              value={form.expense_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              value={form.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Title
            </label>
            <input
              type="text"
              name="expense_title"
              value={form.expense_title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Category
            </label>
            <select
              name="expense_category"
              value={form.expense_category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expense Description
            </label>
            <textarea
              name="expense_description"
              value={form.expense_description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee Signature
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignature}
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-900"
            />
            {form.employee_signature && (
              <p className="text-sm text-green-600 mt-1">Signature uploaded</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="flex-1 bg-white border border-gray-300 text-gray-900 rounded py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-gray-900 text-white rounded py-2 font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
