import { Type, validator } from "@openmrs/esm-framework";

/**
 * This is the config schema. It expects a configuration object which
 * looks like this:
 *
 * ```json
 * { "casualGreeting": true, "whoToGreet": ["Mom"] }
 * ```
 *
 * In OpenMRS Microfrontends, all config parameters are optional. Thus,
 * all elements must have a reasonable default. A good default is one
 * that works well with the reference application.
 *
 * To understand the schema below, please read the configuration system
 * documentation:
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config
 * Note especially the section "How do I make my module configurable?"
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=im-developing-an-esm-module-how-do-i-make-it-configurable
 * and the Schema Reference
 *   https://openmrs.github.io/openmrs-esm-core/#/main/config?id=schema-reference
 */
export const configSchema = {
    TALK_USER: {
        _type: Type.String,
        _default: "admin",
        _description: 'Talk user used',
    },
    TALK_PASSWORD: {
        _type: Type.String,
        _default: "Admin123",
        _description: 'Talk password used',
    },
    TALK_PORT: {
        _type: Type.String,
        _default: "8010",
        _description: 'Talk port',
    },
    TALK_HOST: {
        _type: Type.String,
        _default: "127.0.0.1",
        _description: 'Talk host used',
    },
    TALK_INIT_PASSWORD: {
        _type: Type.String,
        _default: "TALK_PASSWORD",
        _description: 'Talk password used',
    },
    API_USER: {
        _type: Type.String,
        _default: "admin",
        _description: 'API user used',
    },
    API_PASSWORD: {
        _type: Type.String,
        _default: "Admin123",
        _description: 'API password used',
    },
    API_PORT: {
        _type: Type.String,
        _default: "3002",
        _description: 'API port',
    },
    API_HOST: {
        _type: Type.String,
        _default: "127.0.0.1",
        _description: 'API host used',
    },
};

export type Config = {
    TALK_USER: string,
    TALK_PASSWORD: string,
    TALK_PORT: string,
    TALK_HOST: string,
    TALK_INIT_PASSWORD: string,
    API_USER: string,
    API_PASSWORD: string,
    API_PORT: string,
    API_HOST: string,
};