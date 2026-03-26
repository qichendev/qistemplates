import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type TemplateMeta = {
  id: string;
  description: string;
};

export type CreateProjectInput = {
  projectName: string;
  templateId: string;
};

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const templatesDir = path.resolve(currentDir, "../../../templates");

export function getAvailableTemplates(): TemplateMeta[] {
  return [
    {
      id: "node-lib",
      description: "Minimal Node.js package template"
    },
    {
      id: "bun-lib",
      description: "Bun-based TypeScript library template"
    }
  ];
}

async function copyTemplateDirectory(
  sourceDir: string,
  destinationDir: string,
  replacements: Record<string, string>
) {
  const entries = await readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationName = entry.name.replace(/^_gitignore$/, ".gitignore");
    const destinationPath = path.join(destinationDir, destinationName);

    if (entry.isDirectory()) {
      await mkdir(destinationPath, { recursive: true });
      await copyTemplateDirectory(sourcePath, destinationPath, replacements);
      continue;
    }

    const fileInfo = await stat(sourcePath);

    if (!fileInfo.isFile()) {
      continue;
    }

    const content = await readFile(sourcePath, "utf8");
    const rendered = Object.entries(replacements).reduce(
      (current, [key, value]) => current.replaceAll(`{{${key}}}`, value),
      content
    );

    await writeFile(destinationPath, rendered, "utf8");
  }
}

export async function createProject(input: CreateProjectInput) {
  const availableTemplates = getAvailableTemplates();
  const selectedTemplate = availableTemplates.find(
    (template) => template.id === input.templateId
  );

  if (!selectedTemplate) {
    throw new Error(`Unknown template: ${input.templateId}`);
  }

  await readdir(templatesDir);

  const destination = path.resolve(process.cwd(), input.projectName);
  await mkdir(destination, { recursive: true });
  const templateSource = path.join(templatesDir, input.templateId);
  const projectPackageName = input.projectName.startsWith("@")
    ? input.projectName
    : input.projectName.toLowerCase();

  await copyTemplateDirectory(templateSource, destination, {
    projectName: input.projectName,
    packageName: projectPackageName
  });

  return {
    destination,
    projectName: input.projectName,
    templateId: input.templateId
  };
}
