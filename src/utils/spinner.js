import ora from 'ora';

export function createSpinner(text) {
  return ora({
    text,
    spinner: 'dots',
    color: 'cyan'
  });
}

export async function withSpinner(text, asyncFn) {
  const spinner = createSpinner(text).start();

  try {
    const result = await asyncFn();
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    throw error;
  }
}
