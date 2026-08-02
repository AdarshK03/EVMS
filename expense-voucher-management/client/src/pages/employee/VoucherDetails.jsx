import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVoucherById } from '../../services/voucherService';

const FIELD_LABELS = [
  ['voucher_number', 'Voucher Number'],
  ['voucher_date', 'Voucher Date'],
  ['expense_date', 'Expense Date'],
  ['department', 'Department'],
  ['expense_title', 'Expense Title'],
  ['expense_category', 'Expense Category'],
  ['expense_description', 'Expense Description'],
  ['amount', 'Amount'],
  ['status', 'Status'],
  ['approval_date', 'Approval Date'],
  ['rejection_reason', 'Rejection Reason'],
  ['director_signature', 'Director Signature'],
  ['created_at', 'Created At'],
  ['updated_at', 'Updated At'],
];

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  return isNaN(d.getTime()) ? value : d.toLocaleString();
}

function formatAmount(value) {
  if (value === null || value === undefined) return '-';
  return `$${Number(value).toFixed(2)}`;
}

export default function VoucherDetails() {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const result = await getVoucherById(id);
        setVoucher(result.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load voucher');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">
            {error}
          </div>
          <Link to="/employee/vouchers" className="text-gray-600 hover:text-gray-900 text-sm">
            Back to My Vouchers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Voucher Details</h1>
          <Link
            to="/employee/vouchers"
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            Back
          </Link>
        </div>

        <div className="bg-white rounded shadow-sm p-6">
          <dl className="divide-y divide-gray-100">
            {FIELD_LABELS.map(([key, label]) => {
              let value = voucher[key];
              if (key === 'amount') value = formatAmount(value);
              else if (['voucher_date', 'expense_date', 'approval_date'].includes(key)) {
                value = value ? new Date(value).toLocaleDateString() : '-';
              }
              else if (['created_at', 'updated_at'].includes(key)) {
                value = formatDate(value);
              }
              else value = value || '-';

              return (
                <div key={key} className="py-3 flex flex-col sm:flex-row sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500 sm:w-48 shrink-0">
                    {label}
                  </dt>
                  <dd className="text-sm text-gray-900">{value}</dd>
                </div>
              );
            })}
          </dl>

          {voucher.employee_signature && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-2">Employee Signature</p>
              <img
                src={voucher.employee_signature}
                alt="Employee signature"
                className="max-h-24 border border-gray-200 rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
