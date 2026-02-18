
import React from 'react';
import { InvoiceData } from '../types';

interface InvoiceSummaryProps {
  data: InvoiceData;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">Invoice Information</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-zinc-400 text-sm">Number</span>
              <span className="text-white font-medium">{data.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400 text-sm">Date</span>
              <span className="text-white font-medium">{data.date}</span>
            </div>
            {data.dueDate && (
              <div className="flex justify-between">
                <span className="text-zinc-400 text-sm">Due Date</span>
                <span className="text-white font-medium">{data.dueDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-zinc-400 text-sm">Currency</span>
              <span className="text-white font-medium">{data.currency}</span>
            </div>
          </div>
        </div>

        {/* Vendor/Customer Info */}
        <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800">
          <h4 className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">Parties</h4>
          <div className="space-y-4">
            <div>
              <span className="text-zinc-400 text-xs block mb-1">Vendor</span>
              <span className="text-white font-semibold block">{data.vendorName}</span>
              <span className="text-zinc-500 text-xs block truncate">{data.vendorAddress}</span>
            </div>
            <div>
              <span className="text-zinc-400 text-xs block mb-1">Customer</span>
              <span className="text-white font-semibold block">{data.customerName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider text-right">Qty</th>
              <th className="px-6 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider text-right">Price</th>
              <th className="px-6 py-3 text-zinc-400 font-medium text-xs uppercase tracking-wider text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {data.items.map((item, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                <td className="px-6 py-4 text-sm text-zinc-300">{item.description}</td>
                <td className="px-6 py-4 text-sm text-zinc-300 text-right">{item.quantity || 1}</td>
                <td className="px-6 py-4 text-sm text-zinc-300 text-right">
                  {data.currency} {item.unitPrice?.toFixed(2) || (item.total / (item.quantity || 1)).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-sm text-white font-medium text-right">{data.currency} {item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end">
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-zinc-300">{data.currency} {data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">Tax</span>
            <span className="text-zinc-300">{data.currency} {data.taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-zinc-800">
            <span className="text-zinc-200 font-bold">Total Amount</span>
            <span className="text-indigo-400 font-bold text-lg">{data.currency} {data.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
