process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

import JWT, { JwtPayload } from "jsonwebtoken";
const { jsonrepair } = require("jsonrepair");
import extract from "extract-json-from-string";
import { Response } from "express";

function reqBody(request) {
  return typeof request.body === "string"
    ? JSON.parse(request.body)
    : request.body;
}

function queryParams(request) {
  return request.query;
}

function makeJWT(info = {}, expiry = "30d") {
  if (!process.env.JWT_SECRET)
    throw new Error("Cannot create JWT as JWT_SECRET is unset.");
  return JWT.sign(info, process.env.JWT_SECRET, { expiresIn: expiry });
}

function decodeJWT(jwtToken) {
  try {
    return JWT.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
  } catch {}
  return { p: null, id: null, username: null };
}

function parseAuthHeader(headerValue = null, apiKey = null) {
  if (headerValue === null || apiKey === null) return {};
  if (headerValue === "Authorization")
    return { Authorization: `Bearer ${apiKey}` };
  return { [headerValue]: apiKey };
}

function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch {}

  if (jsonString?.startsWith("[") || jsonString?.startsWith("{")) {
    try {
      const repairedJson = jsonrepair(jsonString);
      return JSON.parse(repairedJson);
    } catch {}
  }

  try {
    return extract(jsonString)[0];
  } catch {}

  return fallback;
}

function isValidUrl(urlString = "") {
  try {
    const url = new URL(urlString);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    return true;
  } catch (e) {}
  return false;
}

export {
  reqBody,
  queryParams,
  makeJWT,
  decodeJWT,
  parseAuthHeader,
  safeJsonParse,
  isValidUrl,
};
