/**
 * Claude Code's last written answer, read from the terminal's text, so it
 * can be copied with one click instead of dragging across the screen.
 *
 * Claude Code marks each step with a bullet (● or ⏺): a tool call looks
 * like "● Bash(...)" or "● Read(...)", an answer is plain text. The answer
 * runs until the next bullet or the prompt box, and its lines are indented
 * two spaces under the bullet.
 */

const BULLET = /^[●⏺]\s/;
const TOOL_CALL = /^[●⏺]\s+[\w:.-]+\(/;
/** The prompt box, its rules, and the working spinner end an answer. */
const BOUNDARY = /^(\s*[╭╰─━]|\s*[│┃]\s*>|>\s|\s*[✻✶✳✢·✽*]\s+\w+…)/;

export function lastReply(lines: string[]): string {
  let start = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (BULLET.test(lines[i]) && !TOOL_CALL.test(lines[i])) {
      start = i;
      break;
    }
  }
  if (start < 0) return "";

  const body: string[] = [lines[start].replace(BULLET, "")];
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (BULLET.test(line) || BOUNDARY.test(line)) break;
    body.push(line.replace(/^ {2}/, ""));
  }
  return body
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
}
