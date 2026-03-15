import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const gitCliffModule: DevFlowModule = {
  id: "git-cliff",
  name: "git-cliff",
  description: "Auto-generate changelogs from Conventional Commits",
  category: "git",

  async detect(ctx) {
    const has = fileExists(ctx.root, "cliff.toml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    const actions: ModuleAction[] = [];

    actions.push({
      type: "install",
      dev: true,
      packages: ["git-cliff"],
    });

    actions.push({
      type: "create-file",
      path: "cliff.toml",
      content: `[changelog]
header = """
# Changelog\\n
All notable changes to this project will be documented in this file.\\n
"""
body = """
{% if version %}\\
    ## [{{ version | trim_start_matches(pat="v") }}] - {{ timestamp | date(format="%Y-%m-%d") }}
{% else %}\\
    ## [unreleased]
{% endif %}\\
{% for group, commits in commits | group_by(attribute="group") %}
    ### {{ group | striptags | trim | upper_first }}
    {% for commit in commits %}
        - {% if commit.scope %}*({{ commit.scope }})* {% endif %}\\
            {% if commit.breaking %}[**breaking**] {% endif %}\\
            {{ commit.message | upper_first }}\\
    {% endfor %}
{% endfor %}\\n
"""
trim = true

[git]
conventional_commits = true
filter_unconventional = true
split_commits = false
commit_parsers = [
  { message = "^feat", group = "<!-- 0 -->🚀 Features" },
  { message = "^fix", group = "<!-- 1 -->🐛 Bug Fixes" },
  { message = "^doc", group = "<!-- 3 -->📚 Documentation" },
  { message = "^perf", group = "<!-- 4 -->⚡ Performance" },
  { message = "^refactor", group = "<!-- 2 -->🚜 Refactor" },
  { message = "^style", group = "<!-- 5 -->🎨 Styling" },
  { message = "^test", group = "<!-- 6 -->🧪 Testing" },
  { message = "^chore", group = "<!-- 7 -->⚙️ Miscellaneous" },
]
filter_commits = false
`,
      skipIfExists: true,
    });

    actions.push({
      type: "add-script",
      name: "changelog",
      command: "git-cliff -o CHANGELOG.md",
    });

    return actions;
  },
};

export default gitCliffModule;
