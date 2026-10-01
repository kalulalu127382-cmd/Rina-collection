'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { icon: '✅', label: 'Order Placed', desc: 'Payment verified' },
  { icon: '📦', label: 'Packing', desc: 'Being prepared' },
  { icon: '🚚', label: 'On The Way', desc: 'Out for delivery' },
  { icon: '📍', label: 'Delivered', desc: 'At your door' },
];

export function DeliveryTracker({ status }: { status?: string }) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Map order status to step
    const statusMap: Record<string, number> = {
      pending: 0, confirmed: 1, processing: 1, shipped: 2, delivered: 3,
    };
    setActiveStep(statusMap[status || 'pending'] || 0);
  }, [status]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Animated Map Visual */}
      <div className="relative bg-gradient-to-br from-green-50 via-blue-50 to-green-50 p-6 overflow-hidden">
        {/* Animated road */}
        <svg viewBox="0 0 400 100" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Road background */}
          <path d="M 20 50 Q 120 20 200 50 Q 280 80 380 50" fill="none" stroke="#E5E7EB" strokeWidth="8" strokeLinecap="round" />
          {/* Active road */}
          <path d="M 20 50 Q 120 20 200 50 Q 280 80 380 50" fill="none" stroke="#F85606" strokeWidth="8" strokeLinecap="round"
            strokeDasharray="400" strokeDashoffset={400 - (activeStep / 3) * 400}
            className="transition-all duration-1000 ease-out"
          />
          {/* Location dots */}
          {[20, 140, 260, 380].map((x, i) => {
            const y = i === 0 ? 50 : i === 1 ? 30 : i === 2 ? 70 : 50;
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={i <= activeStep ? 12 : 8} fill={i <= activeStep ? '#F85606' : '#D1D5DB'}
                  className="transition-all duration-500"
                />
                <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fill="white">
                  {i <= activeStep ? '✓' : ''}
                </text>
              </g>
            );
          })}
          {/* Moving truck */}
          <g className="animate-bounce" style={{ animationDuration: '2s' }}>
            <text
              x={20 + (activeStep / 3) * 360}
              y={activeStep === 0 ? 30 : activeStep === 1 ? 10 : activeStep === 2 ? 50 : 30}
              fontSize="20"
              className="transition-all duration-1000 ease-out"
            >
              🚚
            </text>
          </g>
          {/* Warehouse */}
          <text x="15" y="85" fontSize="8" fill="#6B7280" textAnchor="middle">Warehouse</text>
          {/* Destination */}
          <text x="380" y="85" fontSize="8" fill="#6B7280" textAnchor="middle">Your Home</text>
        </svg>

        {/* Live badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] font-semibold text-gray-700">LIVE TRACKING</span>
        </div>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-4 divide-x divide-gray-100">
        {STEPS.map((step, i) => (
          <div key={i} className={`p-3 text-center transition-colors ${i <= activeStep ? 'bg-orange-50' : 'bg-white'}`}>
            <span className="text-lg">{step.icon}</span>
            <p className={`text-[10px] sm:text-xs font-bold mt-1 ${i <= activeStep ? 'text-[#F85606]' : 'text-gray-400'}`}>
              {step.label}
            </p>
            <p className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
