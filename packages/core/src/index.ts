import { mkdir, readdir, writeFile } from "node:fs/promises";
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
    }
  ];
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

  const readme = `# ${input.projectName}

Created from template: ${input.templateId}
`;

  await writeFile(path.join(destination, "README.md"), readme, "utf8");

  return {
    destination,
    projectName: input.projectName,
    templateId: input.templateId
  };
}
