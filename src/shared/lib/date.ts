export function getAge(birthDate: string, now = new Date()) {
  const birth = new Date(`${birthDate}T00:00:00`);
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function isAdult(birthDate: string) {
  return getAge(birthDate) >= 18;
}
