const convertObjectToENV = (obj) => {
  if (!obj || typeof obj !== "object") return;

  let tmpENVContent = "";
  for (let key in obj) {
    tmpENVContent += key + "=" + (!obj[key] ? "" : obj[key] + "\n");
  }

  return tmpENVContent;
};

export default convertObjectToENV;
