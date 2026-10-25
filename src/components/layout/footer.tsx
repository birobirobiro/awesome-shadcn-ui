import { GitHubStars } from "@/components/github-stars";
import Link from "next/link";
import { sponsors } from "@/components/sponsors/sponsors";

/** Static category links for footer navigation */
const FOOTER_CATEGORIES = [
  { title: "Libs and Components", slug: "libs-and-components" },
  { title: "Boilerplates / Templates", slug: "boilerplates-templates" },
  { title: "Plugins and Extensions", slug: "plugins-and-extensions" },
  { title: "Colors and Customizations", slug: "colors-and-customizations" },
  { title: "Animations", slug: "animations" },
  { title: "Tools", slug: "tools" },
];

export function Footer() {
  const quickLinks = [
    { name: "Index", href: "/" },
    { name: "Categories", href: "/categories" },
    { name: "Bookmarks", href: "/bookmarks" },
    {
      name: "GitHub",
      href: "https://github.com/birobirobiro/awesome-shadcn-ui",
      external: true,
    },
  ];

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-mast">
          <div className="footer-brand">
            <Link prefetch={false} href="/" className="brand">
              <img
                src="/logo.svg"
                alt="awesome-shadcn/ui"
                className="footer-wordmark"
                width={510}
                height={343}
              />
              <span className="brand__word">awesome-shadcn/ui</span>
            </Link>
            <p className="footer-tagline">
              A curated list of awesome things related to shadcn/ui. Discover,
              contribute, and grow the community.
            </p>
            <div className="mt-4">
              <GitHubStars />
            </div>

            <div className="sponsorship mt-6 border-t-0 pt-0">
              <span className="sponsorship__label">Sponsored by</span>
              <div className="sponsorship__links">
                {sponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener sponsored"
                    className="sponsorship__link"
                  >
                    {sponsor.LogoComponent}
                    {sponsor.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <h2 className="footer-col__title">Quick links</h2>
              <ul>
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      prefetch={false}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="footer-link"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h2 className="footer-col__title">Categories</h2>
              <ul>
                {FOOTER_CATEGORIES.map((category) => (
                  <li key={category.slug}>
                    <Link
                      prefetch={false}
                      href={`/categories/${category.slug}`}
                      className="footer-link"
                    >
                      {category.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h2 className="footer-col__title">Elsewhere</h2>
              <ul>
                <li>
                  <a
                    href="https://github.com/birobirobiro/awesome-shadcn-ui"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    GitHub repository
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/birobirobiro/awesome-shadcn-ui/blob/main/.github/pull_request_template.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    Pull request template
                  </a>
                </li>
                <li>
                  <a
                    href="https://ui.shadcn.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link"
                  >
                    shadcn/ui
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} awesome-shadcn/ui. All rights
            reserved.
          </p>
          <p>
            Built with Next.js &amp; shadcn/ui. Created by{" "}
            <a
              href="https://birobirobiro.dev/"
              target="_blank"
              rel="noopener noreferrer"
            >
              birobirobiro.dev
            </a>{" "}
            and{" "}
            <a
              href="https://vtxlabs.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              vtxlabs.dev
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
