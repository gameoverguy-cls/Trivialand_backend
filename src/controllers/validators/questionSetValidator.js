import {
  QUESTION_TYPES,
  DIFFICULTY,
  MEDIA_TYPES,
  MATCH_OPTION_SIDE,
} from "../constants/types.js";

/* ------------------------------------------------------- */
/* -------------------- HELPERS -------------------------- */
/* ------------------------------------------------------- */

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

const inEnum = (value, list) => list.includes(value);

/* ------------------------------------------------------- */
/* ----------------- OPTIONS VALIDATION ------------------ */
/* ------------------------------------------------------- */

export const validateOptions = ({ type, mediaType, options }) => {
  if (!Array.isArray(options) || options.length === 0) {
    return "Options must be a non-empty array";
  }

  // ---------- STRUCTURE CHECK ----------
  for (const [i, o] of options.entries()) {
    if (typeof o !== "object" || o === null) {
      return `Option at index ${i} must be an object`;
    }

    // media/text presence rule (generic safety)
    if (!isNonEmptyString(o.optionText) && !isNonEmptyString(o.mediaUrl)) {
      return `Option ${i + 1} must contain optionText or mediaUrl`;
    }

    if (o.matchSide && !inEnum(o.matchSide, MATCH_OPTION_SIDE)) {
      return `Invalid matchSide in option ${i + 1}`;
    }

    if (o.correctOrder != null && typeof o.correctOrder !== "number") {
      return `correctOrder must be a number in option ${i + 1}`;
    }

    if (o.isCorrect != null && typeof o.isCorrect !== "boolean") {
      return `isCorrect must be boolean in option ${i + 1}`;
    }
  }

  /* --------------------------------------------------- */
  /* ---------------- QUESTION TYPE RULES -------------- */
  /* --------------------------------------------------- */

  if (type.code === "MCQ_SINGLE") {
    if (options.length < 2) return "MCQ_SINGLE requires at least 2 options";

    const correct = options.filter((o) => o.isCorrect).length;
    if (correct !== 1) return "MCQ_SINGLE must have exactly one correct option";
  }

  if (type.code === "MCQ_MULTI") {
    if (options.length < 2) return "MCQ_MULTI requires at least 2 options";

    const correct = options.filter((o) => o.isCorrect).length;
    if (correct < 2) return "MCQ_MULTI must have at least 2 correct options";
  }

  if (type.code === "TRUE_FALSE") {
    if (options.length !== 2)
      return "TRUE_FALSE must contain exactly 2 options";

    const correct = options.filter((o) => o.isCorrect).length;
    if (correct !== 1) return "TRUE_FALSE must have exactly one correct answer";
  }

  if (type.code === "MATCH_FOLLOWING") {
    const left = options.filter((o) => o.matchSide === "LEFT");
    const right = options.filter((o) => o.matchSide === "RIGHT");

    if (left.length === 0 || right.length === 0) {
      return "MATCH_FOLLOWING requires LEFT and RIGHT options";
    }

    if (left.length !== right.length) {
      return "LEFT and RIGHT option counts must match";
    }

    if (options.some((o) => !isNonEmptyString(o.matchKey))) {
      return "Each MATCH_FOLLOWING option must contain a matchKey";
    }

    // ensure pairs are unique
    const keys = options.map((o) => o.matchKey);
    if (new Set(keys).size !== keys.length / 2) {
      return "Each matchKey must form exactly one LEFT-RIGHT pair";
    }
  }

  if (type.code === "ORDERING") {
    if (options.length < 2) return "ORDERING requires at least 2 options";

    if (options.some((o) => o.correctOrder == null)) {
      return "All ORDERING options must include correctOrder";
    }

    const orders = options.map((o) => o.correctOrder);
    const unique = new Set(orders);

    if (unique.size !== options.length) {
      return "correctOrder values must be unique";
    }

    // optional strict sequence check (1..n)
    const sorted = [...unique].sort((a, b) => a - b);
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i] !== i + 1) {
        return "correctOrder must be a continuous sequence starting from 1";
      }
    }
  }

  /* --------------------------------------------------- */
  /* ---------------- MEDIA TYPE RULES ----------------- */
  /* --------------------------------------------------- */

  if (mediaType.code === "IMAGE_OPTIONS") {
    if (options.some((o) => !isNonEmptyString(o.mediaUrl))) {
      return "IMAGE_OPTIONS requires mediaUrl for every option";
    }
  }

  if (mediaType.code === "NONE") {
    if (options.some((o) => !isNonEmptyString(o.optionText))) {
      return "Options must contain optionText when mediaType is NONE";
    }
  }

  return null;
};

/* ------------------------------------------------------- */
/* ---------------- QUESTION VALIDATION ------------------ */
/* ------------------------------------------------------- */

export const validateQuestion = (data) => {
  if (!data || typeof data !== "object") {
    return "Invalid request body";
  }

  const {
    questionText,
    type,
    difficulty,
    mediaType,
    category,
    options,
    timeLimit,
  } = data;

  // ---------- BASIC FIELDS ----------
  if (!isNonEmptyString(questionText)) return "Question text is required";

  if (!inEnum(type, QUESTION_TYPES)) return "Invalid question type";

  if (!inEnum(difficulty, DIFFICULTY)) return "Invalid difficulty";

  if (!inEnum(mediaType, MEDIA_TYPES)) return "Invalid media type";

  if (!category) return "Category is required";

  // ---------- OPTIONAL FIELDS ----------
  if (timeLimit != null && (typeof timeLimit !== "number" || timeLimit <= 0)) {
    return "timeLimit must be a positive number";
  }

  // ---------- OPTIONS ----------
  const optionError = validateOptions({ type, mediaType, options });
  if (optionError) return optionError;

  return null; // ✅ fully valid
};
