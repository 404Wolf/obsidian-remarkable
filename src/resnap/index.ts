import type { Orientation } from "../types/enums";
import { execFile as execFileCallback } from "child_process";
import { promisify } from "util";

const execFile = promisify(execFileCallback);

export default async function callReSnap(
  reSnapPath: string,
  reSnapSshkey: string,
  outputPath: string,
  postProcess: string,
  extraArgs: string[] = [],
): Promise<void> {
  try {
    const reSnapOutput = await execFile(reSnapPath, [
      "-k",
      reSnapSshkey,
      "-n",
      "-o",
      outputPath,
      ...extraArgs,
    ]);

    console.log("Command output:", reSnapOutput.stdout);
    const postProcessOutput = await execFile(postProcess, [outputPath]);
    console.log("Postprocess output:", postProcessOutput.stdout);
    if (postProcessOutput.stderr)
      console.error("Postprocess stderr:", postProcessOutput.stderr);
  } catch (error: any) {
    console.error(`Error: ${error.message}\nstderr: ${error.stderr}`);
    throw error;
  }
}
