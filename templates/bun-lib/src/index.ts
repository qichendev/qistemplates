export type GreetingOptions = {
  punctuation?: string;
};

export function greet(name: string, options: GreetingOptions = {}) {
  const punctuation = options.punctuation ?? "!";

  return `Hello, ${name}${punctuation}`;
}
