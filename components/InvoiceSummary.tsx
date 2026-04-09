
import React from 'react';
import { motion } from 'motion/react';
import { InvoiceData } from '../types';

interface InvoiceSummaryProps {
  data: InvoiceData;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ data }) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <motion.div 
          whileHover={{ translateZ: 20 }}
          className="bg-white/5 rounded-2xl p-8 border border-white/5 shadow-inner"
        >
          <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Invoice Details</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Number</span>
              <span className="text-white font-black text-lg">{data.invoiceNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Date</span>
              <span className="text-zinc-200 font-bold">{data.date}</span>
            </div>
            {data.dueDate && (
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Due Date</span>
                <span className="text-zinc-200 font-bold">{data.dueDate}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Currency</span>
              <span className="text-indigo-400 font-black">{data.currency}</span>
            </div>
          </div>
        </motion.div>

        {/* Vendor/Customer Info */}
        <motion.div 
          whileHover={{ translateZ: 20 }}
          className="bg-white/5 rounded-2xl p-8 border border-white/5 shadow-inner"
        >
          <h4 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Parties</h4>
          <div className="space-y-6">
            <div>
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2">Vendor</span>
              <span className="text-white font-black text-xl block leading-tight">{data.vendorName}</span>
              <span className="text-zinc-500 text-xs font-medium block mt-1 leading-relaxed">{data.vendorAddress}</span>
            </div>
            <div className="pt-4 border-t border-white/5">
              <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block mb-2">Customer</span>
              <span className="text-zinc-200 font-bold block">{data.customerName}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Items Table */}
      <div className="bg-white/5 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-8 py-5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em]">Description</th>
                <th className="px-8 py-5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] text-right">Qty</th>
                <th className="px-8 py-5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] text-right">Price</th>
                <th className="px-8 py-5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.2em] text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.items.map((item, idx) => (
                <motion.tr 
                  key={idx} 
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                  className="transition-colors"
                >
                  <td className="px-8 py-6 text-sm text-zinc-300 font-medium">{item.description}</td>
                  <td className="px-8 py-6 text-sm text-zinc-400 text-right font-bold">{item.quantity || 1}</td>
                  <td className="px-8 py-6 text-sm text-zinc-400 text-right font-bold">
                    {data.currency} {item.unitPrice?.toFixed(2) || (item.total / (item.quantity || 1)).toFixed(2)}
                  </td>
                  <td className="px-8 py-6 text-sm text-white font-black text-right">{data.currency} {item.total.toFixed(2)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Section */}
      <div className="flex justify-end">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-full md:w-80 bg-indigo-600 rounded-3xl p-8 shadow-2xl shadow-indigo-500/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="space-y-3 relative z-10">
            <div className="flex justify-between items-center text-indigo-200">
              <span className="text-[10px] font-black uppercase tracking-widest">Subtotal</span>
              <span className="font-bold">{data.currency} {data.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-indigo-200">
              <span className="text-[10px] font-black uppercase tracking-widest">Tax</span>
              <span className="font-bold">{data.currency} {data.taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/20">
              <span className="text-white font-black text-xs uppercase tracking-[0.2em]">Total Amount</span>
              <span className="text-white font-black text-3xl tracking-tighter">{data.currency} {data.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InvoiceSummary;
