import { defineConfig } from 'astro/config';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const onGitHubPages = process.env.GITHUB_ACTIONS === 'true' && !!repository && !!owner;
const isUserSite = onGitHubPages && repository === `${owner}.github.io`;

export default defineConfig({
  ...(onGitHubPages ? { site: `https://${owner}.github.io` } : {}),
  base: onGitHubPages && !isUserSite ? `/${repository}/` : '/',
  output: 'static',
  server: { host: true },
});
