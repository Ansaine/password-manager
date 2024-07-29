// Environment variables
import dotenv from 'dotenv';
dotenv.config()

// Encryption function for storing passwords in 'details'
import crypto from 'crypto';
const algorithm = process.env.ALGORITHM;
// IMP - keys need to be converted to buffers else gives type error
const key = Buffer.from(process.env.KEY.replace(/\s/g, ''), 'hex');     // crypto.randomBytes(32); 
const iv = Buffer.from(process.env.IV.replace(/\s/g, ''), 'hex');       // crypto.randomBytes(16);
                 

console.log("IV is : ",iv)

function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decryption function for passwords in 'details'
function decrypt(text) {
    let [iv, encryptedText] = text.split(':');
    iv = Buffer.from(iv, 'hex');
    encryptedText = Buffer.from(encryptedText, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

export default{
    encrypt,
    decrypt
}

