process.env.NODE_ENV === "development"
  ? require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` })
  : require("dotenv").config();

import JWT, { JwtPayload } from "jsonwebtoken";
const { jsonrepair } = require("jsonrepair");
import extract from "extract-json-from-string";
import { Response } from "express";

import User from "../models/user";

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

// Note: Only valid for finding users in multi-user mode
// as single-user mode with password is not a "user"
async function userFromSession(request, response?: Response) {
  if (!!response && !!response.locals?.user) {
    return response.locals.user;
  }

  const auth = request.header("Authorization");
  const token = auth ? auth.split(" ")[1] : null;

  if (!token) {
    return null;
  }

  const jwt = decodeJWT(token);
  if (!jwt || !jwt.id) {
    return null;
  }

  const foundUser = await User.get({ id: jwt.id });
  return foundUser;
}

function decodeJWT(jwtToken) {
  try {
    return JWT.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
  } catch {}
  return { p: null, id: null, username: null };
}

function multiUserMode(response) {
  return response?.locals?.multiUserMode;
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
  multiUserMode,
  queryParams,
  makeJWT,
  decodeJWT,
  userFromSession,
  parseAuthHeader,
  safeJsonParse,
  isValidUrl,
};
