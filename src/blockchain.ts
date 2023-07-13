
import { hash, hashValidado } from "./helpers"

export interface Bloco {
    header: {
        nonce: number
        hashBloco: string
    }
    payload: {
        sequence: number
        timestamp: number
        dados: any
        hashAnterior: string
    }
}


export class Blockchain {
    #chain: Bloco[] = []
    private prefixoPow = "a"

    constructor(private dificuldade: number = 4) {
        this.#chain.push(this.criarBlocoGenesis())

    }
    private criarBlocoGenesis(): Bloco {
        const payload: Bloco['payload'] = {
            sequence: 0,
            timestamp: +new Date(),
            dados: "Bloco inicial",
            hashAnterior: ""
        }
        return {
            header: {
                nonce: 0,
                hashBloco: hash(JSON.stringify(payload.dados))
            }, payload
        }
    }
    get chain(): Bloco[] {
        return this.#chain
    }
    private get ultimoBloco(): Bloco {
        return this.#chain.at(-1) as Bloco
    }
    private hashUltimoBloco(): string {
        return this.ultimoBloco.header.hashBloco
    }
    criarBloco(dado: any): Bloco['payload'] {
        const novoBloco: Bloco['payload'] = {
            sequence: this.ultimoBloco.payload.sequence + 1,
            timestamp: +new Date(),
            dados: dado,
            hashAnterior: this.hashUltimoBloco()
        }
        console.log(`Bloco #${novoBloco.sequence} criado: ${JSON.stringify(novoBloco)}`)
        return novoBloco
    }
    minerarBloco(bloco: Bloco['payload']) {
        let nonce = 0;
        let inicio: number = +new Date()
        while (true) {
            const hashBloco: string = hash(JSON.stringify(bloco))
            const hashPow: string = hash(hashBloco + nonce)
            if (hashValidado(
                {
                    hash: hashPow,
                    dificuldade: this.dificuldade,
                    prefixo: this.prefixoPow
                })) {
                const final: number = +new Date()
                const hashReduzido: string = hashBloco.slice(0, 12)
                const tempoMineracao: number = (final - inicio)
                console.log(`Bloco #${bloco.sequence} minerado em ${tempoMineracao}s. Hash ${hashReduzido} (${nonce} tentativas)`)
                return {
                    blocoMinerado: {
                        payload: { ...bloco },
                        header: {
                            nonce, hashBloco
                        }
                    }
                }
            }
            nonce++
        }
    }
    verificarBloco(bloco: Bloco): boolean {
        if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
            console.error(`Bloco #${bloco.payload.sequence} inválido : O hash anterior é ${this.hashUltimoBloco().slice(0, 12)} e não ${bloco.payload.hashAnterior.slice(0, 12)}`)
            return false
        }
        const hashTest = hash(hash(JSON.stringify(bloco.payload)) + bloco.header.nonce)
        if (!hashValidado({ hash: hashTest, dificuldade: this.dificuldade, prefixo: this.prefixoPow })) {
            console.error(`Bloco #${bloco.payload.sequence} inválido : O nounce anterior é ${this.hashUltimoBloco().slice(0, 12)} e não ${bloco.payload.hashAnterior.slice(0, 12)}`)
        }
        return true
    }
    enviarBloco(bloco: Bloco): Bloco[] {
        if (this.verificarBloco(bloco)) {
            this.#chain.push(bloco)
            console.log(`Bloco #${bloco.payload.sequence} foi adicionado a blockchain : ${JSON.stringify(bloco, null, 2)}`)
        }
        return this.#chain
    }
}