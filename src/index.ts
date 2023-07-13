import { Blockchain } from "./blockchain"
const dificuldade = Number(process.argv[2]) || 4

const blockchain = new Blockchain(dificuldade)


const numBlocos = Number(process.argv[3]) || 10
let chain = blockchain.chain

for (let index = 1; index <= numBlocos; index++) {
   const bloco = blockchain.criarBloco(`Bloco ${index}`)

   const mineInfo = blockchain.minerarBloco(bloco)
   chain = blockchain.enviarBloco(mineInfo.blocoMinerado)
   console.log("--- BLOCKCHAIN ---")
   console.log(chain)
    
}