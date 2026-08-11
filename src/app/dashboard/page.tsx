'use client';

// Redirect ke halaman utama (dashboard ada di root page)
import { redirect } from 'next/navigation';

export default function DashboardRedirect() {
  redirect('/');
}
