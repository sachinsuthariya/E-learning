"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encrypt = void 0;
const crypto = require("crypto");
const JSEncrypt = require("node-jsencrypt");
class Encrypt {
    constructor() {
        this.algorithm = "aes-256-ctr";
        // NOTE :: Set password from .env for encrypt and decrypt
        this.password = process.env.ENCRYPT_AES_256_CTR_PASSWORD;
    }
    encrypt(text) {
        const cipher = crypto.createCipher(this.algorithm, this.password);
        let crypted = cipher.update(text, "utf8", "hex");
        crypted += cipher.final("hex");
        return crypted;
    }
    /**
     * decrypt
     */
    decrypt(text) {
        const decipher = crypto.createDecipher(this.algorithm, this.password);
        let dec = decipher.update(text, "hex", "utf8");
        dec += decipher.final("utf8");
        return dec;
    }
    /**
     * convertToSha
     */
    convertToSha(pwd, salt) {
        const hash = crypto.createHmac("sha512", salt); /** Hashing algorithm sha512 */
        hash.update(pwd);
        const value = hash.digest("hex");
        return { salt, passwordHash: value };
    }
    encryptwithJS(key) {
        const text = typeof key === "string" ? key : `${key}`;
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(process.env.jsEncPubKey);
        const hash = jsEncrypt.encrypt(text);
        return hash;
    }
}
exports.Encrypt = Encrypt;
//# sourceMappingURL=encrypt.js.map