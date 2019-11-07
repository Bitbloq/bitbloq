export const getChromeVersion = userAgent => {
  if (userAgent) {
    const pieces = userAgent.match(
      /Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/
    );
    return pieces && pieces[1] ? parseInt(pieces[1]) : 0;
  } else {
    return 0;
  }
};

export const isValidEmail = email =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export const sortByCreatedAt = (a, b) => {
  const aCreatedAt = a && a.createdAt;
  const bCreatedAt = b && b.createdAt;
  return Math.sign(bCreatedAt - aCreatedAt);
};
