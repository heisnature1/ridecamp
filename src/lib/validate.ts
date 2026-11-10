/**
 * Input validation and sanitising for everything a visitor or admin types.
 *
 * Two jobs:
 *  1. `sanitize` scrubs text before it is stored — strips control characters,
 *     angle brackets and backticks, collapses whitespace and caps length, so a
 *     stored value can never be interpreted as markup or SQL.
 *  2. `VALIDATORS` / `validate` give the forms a single source of truth for
 *     "is this acceptable" (shape, length, allowed characters).
 *
 * React escapes everything it renders, and nothing in this app ever sets
 * innerHTML, so this is defence in depth rather than the only line of defence.
 */

export type FieldRule = {
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  /** allowed characters, tested against the whole value */
  pattern?: RegExp;
  /** message shown when `pattern` fails */
  patternMessage?: string;
  /** applied to the value before the pattern is tested (e.g. phone digits) */
  normalize?: (value: string) => string;
};

/** Characters that have no business being in a name, city or message. */
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Strip anything that could be read as markup, plus control characters. */
export function sanitize(value: unknown, maxLength = 500): string {
  return String(value ?? "")
    .replace(CONTROL_CHARS, "")
    .replace(/[<>]/g, "")
    .replace(/[`]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Same, but keeps line breaks (notes and messages). */
export function sanitizeMultiline(value: unknown, maxLength = 2000): string {
  return String(value ?? "")
    .replace(CONTROL_CHARS, "")
    .replace(/[<>]/g, "")
    .replace(/[`]/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, maxLength);
}

/* ------------------------------------------------------------------ */
/* common shapes                                                       */
/* ------------------------------------------------------------------ */

export const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[A-Za-z]{2,}$/;
/** Ghanaian mobile: 10 digits starting 0, or +233 followed by 9 digits. */
export const GH_PHONE_RE = /^(?:\+?233\d{9}|0\d{9})$/;

export function normalizePhone(value: string): string {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+233")) return `0${digits.slice(4)}`;
  if (digits.startsWith("233")) return `0${digits.slice(3)}`;
  return digits;
}

export function isValidPhone(value: string): boolean {
  return GH_PHONE_RE.test(normalizePhone(value).replace(/^\+/, ""));
}

/** Reject payloads that try to smuggle nested structures into a lead field. */
export function sanitizeRecord(
  record: Record<string, unknown>,
  maxLength = 500,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "object") continue;
    const cleanKey = sanitize(key, 80);
    const cleanValue = sanitize(value, maxLength);
    if (cleanKey && cleanValue) out[cleanKey] = cleanValue;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* form rules                                                          */
/* ------------------------------------------------------------------ */

const NAME_PATTERN = /^[\p{L}\p{M}' .-]+$/u;

export const RULES: Record<string, FieldRule> = {
  name: { label: "Name", required: true, min: 2, max: 80, pattern: NAME_PATTERN, patternMessage: "Use letters, spaces, apostrophes and hyphens only." },
  phone: {
    label: "Phone number",
    required: true,
    min: 9,
    max: 20,
    pattern: GH_PHONE_RE,
    patternMessage: "Enter a Ghanaian mobile number, e.g. 055 894 1297.",
    normalize: normalizePhone,
  },
  email: { label: "Email", max: 120, pattern: EMAIL_RE, patternMessage: "Enter a valid email address." },
  city: { label: "City", max: 60, pattern: /^[\p{L}\p{M}' .-]+$/u, patternMessage: "Use letters only." },
  company: { label: "Company", max: 120 },
  bikes: { label: "Number of bikes", max: 6, pattern: /^\d{1,5}$/, patternMessage: "Enter a number." },
  notes: { label: "Notes", max: 2000 },
  date: { label: "Preferred date", max: 20, pattern: /^\d{4}-\d{2}-\d{2}$/, patternMessage: "Pick a date." },
  interest: { label: "Interest", max: 60 },
  occupation: { label: "Occupation", max: 80 },
  income: { label: "Income range", max: 60 },
  option: { label: "Preferred option", max: 80 },
  useCase: { label: "Use case", max: 500 },
  riderType: { label: "Rider type", max: 60 },
};

export type ValidationResult = { ok: true; value: string } | { ok: false; error: string };

/** Anything that looks like an attempt at markup or a script URL. */
const SUSPICIOUS = /<\s*\/?\s*[a-z!]|javascript\s*:|on(error|load|click)\s*=|\$\{|\}\}/i;

/** Validate one field against a rule, returning the cleaned value. */
export function validate(raw: unknown, rule: FieldRule): ValidationResult {
  const multiline = rule.max !== undefined && rule.max > 500;
  const value = multiline ? sanitizeMultiline(raw, rule.max) : sanitize(raw, rule.max ?? 500);

  // refuse markup outright rather than silently storing the scrubbed remains
  if (SUSPICIOUS.test(String(raw ?? ""))) {
    return { ok: false, error: `${rule.label} contains characters that are not allowed.` };
  }

  if (rule.required && !value) return { ok: false, error: `${rule.label} is required.` };
  if (!value) return { ok: true, value };
  if (rule.min && value.length < rule.min)
    return { ok: false, error: `${rule.label} is too short.` };
  if (rule.max && value.length > rule.max)
    return { ok: false, error: `${rule.label} must be ${rule.max} characters or fewer.` };
  if (rule.pattern) {
    const subject = rule.normalize ? rule.normalize(value) : value;
    // phone rules accept either spaced or compact input
    const compact = subject.replace(/[\s()-]/g, "");
    if (!rule.pattern.test(subject) && !rule.pattern.test(compact))
      return { ok: false, error: rule.patternMessage ?? `${rule.label} is not valid.` };
  }
  return { ok: true, value };
}

/**
 * Validate a whole submitted lead against a map of field → rule.
 * Unknown keys are sanitised and kept (forms evolve), known ones are checked.
 */
export function validateLead(
  data: Record<string, string>,
  rules: Record<string, FieldRule> = {},
): { ok: true; data: Record<string, string> } | { ok: false; error: string } {
  const clean = sanitizeRecord(data, 2000);
  for (const [key, rule] of Object.entries(rules)) {
    const result = validate(clean[key] ?? "", rule);
    if (!result.ok) return { ok: false, error: result.error };
    if (result.value) clean[key] = result.value;
    else delete clean[key];
  }
  return { ok: true, data: clean };
}

/** Strip unsafe schemes from a URL before it is used in a link or an image. */
export function safeUrl(raw: string): string | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  if (value.startsWith("/")) return value;
  if (/^https?:\/\//i.test(value)) return value;
  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(value)) return value;
  return null;
}
