function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "") // remove spaces
    .replace(/[^a-z0-9]/g, ""); // remove special chars
}

export default makeSlug;
