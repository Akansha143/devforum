export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateDisplayName = (name) => {
  return name.trim().length >= 2;
};

export const validatePostTitle = (title) => {
  return title.trim().length >= 5 && title.trim().length <= 200;
};

export const validatePostContent = (content) => {
  return content.trim().length >= 10;
};

export const validateComment = (comment) => {
  return comment.trim().length >= 1 && comment.trim().length <= 500;
};