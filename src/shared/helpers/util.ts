import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as base64url from 'base64-url';
import crypto = require('crypto');
import { Request } from 'express';
import { FACEBOOK_SECRET_KEY } from 'src/config';

export function getOrThrowClientError(req: Request, type: string, key: string) {
    let array;
    switch (type) {
        case 'query':
            array = req.query;
            break;

        case 'body':
            array = req.body;
            break;

        default:
            throw new BadRequestException(`Unknown type: ${type}`);
    }

    if (!(key in array)) {
        throw new BadRequestException(`Missing ${type} parameter '${key}'`);
    }

    const value = array[key];
    if (value === null) {
        throw new BadRequestException(`Missing ${type} parameter '${key}'`);
    }

    return value;
}


export const toAbsoluteUrl = (req: Request, url: string) => {
    return `${req.protocol}://${req.get('host')}${req.originalUrl}${url}`;
}

function decodePayload(payload) {
    const bodyJson = base64url.decode(urlDecode(payload))
    try {
        return JSON.parse(bodyJson)
    } catch (error) {
        throw new BadRequestException(error.message);
    }
}

export function replaceBodyWithDecodedPayload(req: Request, payload) {
    const body = decodePayload(payload)
    req.body = body
}

function getExpectedSignature(payload) {
    const hmac = crypto.createHmac('sha256', FACEBOOK_SECRET_KEY);
    hmac.update(payload);
    return hmac.digest('base64');
}

export function validateSignature(actualSignature, payload) {
    const expectedSignature = getExpectedSignature(payload);
    // For some reason, the actual signature always has a '=' appended
    const actualSignatureWithEqualsSign = actualSignature + '=';
    if (actualSignatureWithEqualsSign !== expectedSignature) {
        throw new UnauthorizedException('Invalid signature');
    }
}

function urlDecode(value: string) {
    return value.replace(/-/g, '+').replace(/_/g, '/');
}

function decodeSignature(encodedSignature) {
    return urlDecode(encodedSignature);
}

export function getSignedRequest(req: Request) {
    return getOrThrowClientError(req, 'body', 'signed_request');
}

export function getSignatureAndPayloadFromSignedRequest(signedRequest) {
    const [encodedSignature, payload] = signedRequest.split('.', 2);
    if (encodedSignature === null || payload === null) {
        throw new BadRequestException('Signed request has invalid format');
    }
    const signature = decodeSignature(encodedSignature);
    return [signature, payload];
}

export function checkImage(url: string) {
    return (url?.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

export function findHashtags(searchText) {
    const regexp = /(\s|^)\#\w\w+\b/gm
    let result = searchText.match(regexp);
    if (result) {
        result = result.map((s:string) => { return s.trim();});
        return result;
    } else {
        return false;
    }
}