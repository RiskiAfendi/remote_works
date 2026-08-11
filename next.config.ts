import type { NextConfig } from 'next';

// Deteksi basePath secara dinamis untuk GitHub Pages sub-path deployment
const isGithubActions = process.env.GITHUB_ACTIONS || false;
let basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

if (!basePath && isGithubActions && process.env.GITHUB_REPOSITORY) {
  const repoName = process.env.GITHUB_REPOSITORY.split('/')[1];
  if (repoName && !repoName.endsWith('.github.io')) {
    basePath = `/${repoName}`;
  }
}

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  trailingSlash: true,
};

export default nextConfig;

