"use client";

import { Github } from "@/components/icons/github-icon";

import {} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PRSubmissionDialog } from "@/components/pr-submission-dialog";

interface SubmitCTAProps {
  totalItems: number;
  totalCategories: number;
}

export function SubmitCTA({ totalItems, totalCategories }: SubmitCTAProps) {
  return (
    <section id="contribute" className="cta">
      <div className="shell cta__grid">
        <div>
          <h2 className="cta__title">Contribute to awesome-shadcn/ui</h2>
          <p className="cta__text">
            Have an awesome shadcn/ui related project or resource? Share it with
            the community. Open a PR and help grow this curated list.
          </p>
          <dl className="cta__stats" aria-label="Directory summary">
            <div className="cta__stat">
              <dt className="cta__stat-label">Resources</dt>
              <dd className="cta__stat-value">{totalItems}</dd>
            </div>
            <div className="cta__stat">
              <dt className="cta__stat-label">Categories</dt>
              <dd className="cta__stat-value">{totalCategories}</dd>
            </div>
            <div className="cta__stat">
              <dt className="cta__stat-label">Pull request</dt>
              <dd className="cta__stat-value">1</dd>
            </div>
          </dl>
        </div>
        <div className="cta__actions">
          <PRSubmissionDialog
            trigger={
              <Button size="lg" className="gap-2">
                <Github className="h-4 w-4" aria-hidden="true" />
                Submit a resource
              </Button>
            }
          />
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a
              href="https://github.com/birobirobiro/awesome-shadcn-ui/blob/main/.github/pull_request_template.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Manual PR
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
