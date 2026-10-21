import { SectionHeader } from "./section-header";
import { SectionTag } from "./section-tag";

interface Row {
  capability: string;
  devflow: string;
  manual: string;
  createCli: string;
  monorepo: string;
}

const ROWS: Row[] = [
  {
    capability: "Adds the workflow to an existing repository",
    devflow: "Yes",
    manual: "Yes",
    createCli: "No — it creates the project",
    monorepo: "Partially",
  },
  {
    capability: "Adapts config to the detected stack and package manager",
    devflow: "Yes",
    manual: "By hand",
    createCli: "One stack only",
    monorepo: "Partially",
  },
  {
    capability: "Git hooks, commit validation, lint-staged",
    devflow: "Yes",
    manual: "By hand",
    createCli: "Rarely",
    monorepo: "No",
  },
  {
    capability: "CI workflow that lints, type-checks, tests and builds",
    devflow: "Yes",
    manual: "By hand",
    createCli: "Rarely",
    monorepo: "No — you write the pipeline",
  },
  {
    capability: "Dockerfile, compose file and .dockerignore",
    devflow: "Yes",
    manual: "By hand",
    createCli: "Sometimes",
    monorepo: "No",
  },
  {
    capability: "Task graph, build caching, generators",
    devflow: "No",
    manual: "No",
    createCli: "No",
    monorepo: "Yes — this is the core feature",
  },
  {
    capability: "Reproducible across every repository",
    devflow: "Yes",
    manual: "No — copy-paste drifts",
    createCli: "Only for new projects",
    monorepo: "Yes",
  },
  {
    capability: "Applies to a repository you already have",
    devflow: "Yes",
    manual: "Yes",
    createCli: "No",
    monorepo: "No",
  },
];

function Cell({ value }: { value: string }) {
  const isYes = value === "Yes";
  return (
    <td
      className={`px-5 py-4 text-[14px] ${
        isYes ? "text-accent font-medium" : "text-muted"
      }`}
    >
      {value}
    </td>
  );
}

export function ComparisonTable() {
  return (
    <section className="py-24 max-md:py-12">
      <div className="mx-auto max-w-7xl px-10 max-md:px-5">
        <SectionHeader
          tag={<SectionTag>Comparison</SectionTag>}
          title="What DevFlow is, and what it is not"
          description="DevFlow is a workflow generator. It does not scaffold applications, and it is not a build system. Here is the honest picture, including the column where DevFlow has nothing to offer."
        />

        <div className="overflow-x-auto rounded-3xl border border-line">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-card">
                <th className="px-5 py-4 font-roboto-mono text-[13px] font-medium text-muted">
                  Capability
                </th>
                <th className="px-5 py-4 font-roboto-mono text-[13px] font-medium text-accent">
                  DevFlow CLI
                </th>
                <th className="px-5 py-4 font-roboto-mono text-[13px] font-medium text-muted">
                  Manual setup
                </th>
                <th className="px-5 py-4 font-roboto-mono text-[13px] font-medium text-muted">
                  create-* CLI
                </th>
                <th className="px-5 py-4 font-roboto-mono text-[13px] font-medium text-muted">
                  Nx / Turborepo
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, index) => (
                <tr
                  key={row.capability}
                  className={index % 2 === 0 ? "bg-page" : "bg-surface"}
                >
                  <th className="px-5 py-4 text-[14px] font-normal text-foreground">
                    {row.capability}
                  </th>
                  <Cell value={row.devflow} />
                  <Cell value={row.manual} />
                  <Cell value={row.createCli} />
                  <Cell value={row.monorepo} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-[14px] text-muted">
          Nx and Turborepo are not alternatives to DevFlow — they own the task
          graph and the cache. Read{" "}
          <a
            href="/compare/nx"
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            DevFlow vs Nx
          </a>{" "}
          and{" "}
          <a
            href="/compare/turborepo"
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            DevFlow vs Turborepo
          </a>{" "}
          for the detail, or{" "}
          <a
            href="/compare/manual-setup"
            className="text-accent underline underline-offset-4 hover:opacity-80"
          >
            DevFlow vs manual setup
          </a>{" "}
          for the cost breakdown.
        </p>
      </div>
    </section>
  );
}
