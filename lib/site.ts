export const siteConfig = {
  name: "AI News & Business Intelligence",
  shortName: "AI Intelligence",
  description:
    "A daily AI intelligence platform for tracked signals, implementation use cases, business impact analysis, and analyst-reviewed predictions.",
  ogDescription:
    "Daily AI signals, implementation use cases, business impact analysis, and analyst-reviewed predictions in one dashboard.",
  tagline: "Daily AI signals, use cases, and business impact",
  footerDescription:
    "A daily intelligence product for AI signals, implementation use cases, business impact analysis, and analyst-reviewed predictions.",
  repositorySlug: "ai-news-business-intelligence",
  localUrl: "http://localhost:3000",
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.localUrl;
}

export function getRepositoryUrl() {
  return process.env.NEXT_PUBLIC_REPOSITORY_URL;
}
