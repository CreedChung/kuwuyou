export interface PasswordStrength {
  score: number;
  label: string;
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    special: boolean;
  };
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  // Calculate score based on checks
  let score = 0;
  if (checks.length) score += 20;
  if (checks.lowercase) score += 20;
  if (checks.uppercase) score += 20;
  if (checks.number) score += 20;
  if (checks.special) score += 20;

  // Determine label based on score
  let label = "弱";
  if (score >= 80) label = "强";
  else if (score >= 60) label = "中";
  else if (score >= 40) label = "一般";

  return {
    score,
    label,
    checks,
  };
}