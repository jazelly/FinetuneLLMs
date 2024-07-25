// const dotenv = require("dotenv").config().parsed;

import dotenv from "dotenv";

/**
 * The type indicates to what extent we the .env file should be like.
 *
 * It is ok to not be 100% accurate with real-world case as the
 * real-world case is they are all possibly undefined.
 */
export interface Envs {
  NODE_ENV: string;
  SERVER_PORT: number | undefined;
  AUTH_TOKEN: string | undefined;
  JWT_SECRET: string | undefined;
  TRAINER_API_URL: string | undefined;

  DATABASE_URL: string | undefined;
  DATASETS_PATH_FROM_ROOT: string | undefined;
  DATABASE_PATH_FROM_ROOT: string | undefined;

  ENABLE_HTTPS: boolean;
  HTTPS_KEY_PATH: string | undefined;
  HTTPS_CERT_PATH: string | undefined;
}

type EnvsParser<T> = {
  [K in keyof T]: (
    raw: undefined extends T[K] ? string | undefined : string
  ) => T[K];
};

/**
 * A mapper for .env
 * Every env var must be provided with a parser here
 */
const ENVS_PARSER: EnvsParser<Envs> = {
  NODE_ENV: (raw: Envs["NODE_ENV"]) => raw,
  SERVER_PORT: (raw: string | undefined) => {
    if (raw === undefined) return undefined;
    return parseInt(raw, 10);
  },
  AUTH_TOKEN: (raw: string | undefined) => raw,

  JWT_SECRET: (raw: Envs["JWT_SECRET"]) => raw,
  TRAINER_API_URL: (raw: Envs["TRAINER_API_URL"]) => raw,

  DATABASE_URL: (raw: Envs["DATABASE_URL"]) => raw,
  DATASETS_PATH_FROM_ROOT: (raw: string | undefined) => {
    return raw || "src/storage/datasets/";
  },

  DATABASE_PATH_FROM_ROOT: (raw: string | undefined) => {
    return raw || "src/storage/finetunellms.db";
  },

  ENABLE_HTTPS: (raw: string | undefined) => {
    return raw === "true";
  },
  HTTPS_KEY_PATH: (raw: string | undefined) => raw,
  HTTPS_CERT_PATH: (raw: string | undefined) => raw,
};

const envs = dotenv.config().parsed;

const parseEnvs = (envs: dotenv.DotenvParseOutput | undefined): Envs => {
  if (!envs)
    throw new Error(
      "must provide .env file. Have you copied .env.example to .env?"
    );

  const result: Partial<Envs> = {};
  for (const entry of Object.entries(envs)) {
    const [key, value] = entry;
    const parser = ENVS_PARSER[key];
    if (!parser)
      throw new Error(
        `No parser found for .env key: ${key}. Did you forget to update the ENVS_PARSER?`
      );
    result[key] = ENVS_PARSER[key](value);
  }
  return result as Envs;
};

export const config = parseEnvs(envs);
