import { BinaryLike, createHash } from "crypto";

export function hash(dado: BinaryLike): string {
   return  createHash('sha256').update(JSON.stringify(dado)).digest("hex")
}

export function hashValidado({hash,dificuldade = 4, prefixo = '0'}: {hash:string, dificuldade:number, prefixo:string}){
    const check = prefixo.repeat(dificuldade)
    return hash.startsWith(check)
}