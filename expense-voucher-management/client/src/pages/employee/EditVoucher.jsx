import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVoucherById, updateVoucher, submitVoucher } from '../../services/voucherService';

const CATEGORIES = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Hardware', 'Other'];

export default function EditVoucher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await getVoucherById(id);
        const v = result.data;
        if (v.status !== 'Draft') {
          setError('Only Draft vouchers can be edited');
          return;
        }
        setForm({
          expense_date: v.expense_date ? v.expense_date.split('T')[0] : '',
          department: v.department || '',
          expense_title: v.expense_title || '',
          expense_category: v.expense_category || '',
          expense_description: v.expense_description || '',
          amount: v.amount || '',
          employee_signature: v.employee_signature || '',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load voucher');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

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

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateVoucher(id, form);
      navigate(`/employee/vouchers/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update voucher');
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.employee_signature) {
      setError('Employee signature is required before submitting');
      return;
    }

    setSaving(true);

    try {
      await updateVoucher(id, form);
      await submitVoucher(id);
      navigate(`/employee/vouchers/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit voucher');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate('/employee/vouchers')}
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Voucher</h1>
          <button
            onClick={() => navigate(`/employee/vouchers/${id}`)}
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
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-white border border-gray-300 text-gray-900 rounded py-2 font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 bg-gray-900 text-white rounded py-2 font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
