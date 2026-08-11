import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { I18nProvider } from '@/context/I18nContext';
import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Remote Works - Job Application Tracker',
  description: 'Dashboard CRUD tracker lamaran kerja remote dengan desain Premium Liquid Glass',
  keywords: ['remote work', 'job tracker', 'application tracker', 'dashboard'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('rw-theme');
                  if (!theme) {
                    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <I18nProvider>
            <MainLayout>
              {children}
            </MainLayout>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
