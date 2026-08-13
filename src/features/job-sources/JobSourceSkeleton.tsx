'use client';

import React from 'react';

export function JobSourceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex flex-col justify-between rounded-2xl p-5 bg-[var(--glass-surface)] border border-[var(--glass-border)] space-y-4"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-slate-300/30 dark:bg-slate-700/30" />
                <div className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-300/30 dark:bg-slate-700/30" />
                  <div className="h-3 w-20 rounded bg-slate-300/30 dark:bg-slate-700/30" />
                </div>
              </div>
              <div className="h-6 w-16 rounded-full bg-slate-300/30 dark:bg-slate-700/30" />
            </div>

            <div className="flex gap-2">
              <div className="h-5 w-24 rounded bg-slate-300/30 dark:bg-slate-700/30" />
              <div className="h-5 w-24 rounded bg-slate-300/30 dark:bg-slate-700/30" />
            </div>

            <div className="h-14 rounded-xl bg-slate-300/20 dark:bg-slate-800/40 p-3" />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--glass-border)]">
            <div className="h-8 w-16 rounded-lg bg-slate-300/30 dark:bg-slate-700/30" />
            <div className="h-8 w-16 rounded-lg bg-slate-300/30 dark:bg-slate-700/30" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobSourceSkeleton;
