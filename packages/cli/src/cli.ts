#!/usr/bin/env node

import { intro, isCancel, outro, select, text } from "@clack/prompts";
import { Command } from "commander";
import packageJson from "../package.json" with { type: "json" };
import { createProject, getAvailableTemplates } from "qitemplates-core";

const program = new Command();

program
  .name("qi")
  .description("Create projects from templates stored in this monorepo.")
  .version(packageJson.version);

program
  .command("list")
  .description("List available templates")
  .action(() => {
    const templates = getAvailableTemplates();

    for (const template of templates) {
      console.log(`${template.id}\t${template.description}`);
    }
  });

program
  .command("create")
  .description("Create a project from a template")
  .argument("[name]", "Project directory name")
  .option("-t, --template <template>", "Template identifier")
  .action(async (name: string | undefined, options: { template?: string }) => {
    intro("qi");

    const templates = getAvailableTemplates();
    const templateId =
      options.template ??
      (await select({
        message: "Select a template",
        options: templates.map((template) => ({
          value: template.id,
          label: template.id,
          hint: template.description
        }))
      }));

    if (isCancel(templateId)) {
      outro("Cancelled.");
      process.exit(0);
    }

    const projectName =
      name ??
      (await text({
        message: "Project name",
        placeholder: "my-app",
        validate(value) {
          return value.trim().length > 0 ? undefined : "Project name is required.";
        }
      }));

    if (isCancel(projectName)) {
      outro("Cancelled.");
      process.exit(0);
    }

    const result = await createProject({
      projectName,
      templateId
    });

    outro(`Created ${result.projectName} from ${result.templateId}.`);
  });

program.parseAsync(process.argv);
