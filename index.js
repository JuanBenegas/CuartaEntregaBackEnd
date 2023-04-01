import fs from 'fs'
import express from 'express';

const app = express()

class ProductManager {
    idAuto = 1
    #products = []

    constructor() {
        this.path = './products.json'
    }

    async getProduct(limit) {
        if(!limit){
            try {
                let products = []
                if (fs.existsSync(this.path)) {
                    const fileData = await fs.promises.readFile(this.path, 'utf-8')
                    products = JSON.parse(fileData)
                }
                return products
            } catch (e) {
                console.log('Error en getProducts:', e)
                throw e
            }
        }

        if(limit > 0){
            try {
                let products = []
                let productsLimit = []
                if (fs.existsSync(this.path)) {
                    const fileData = await fs.promises.readFile(this.path, 'utf-8')
                    products = JSON.parse(fileData)
                    for (let i = 0; i < limit; i++){
                        productsLimit.push(products[i])
                    }
                }
                return productsLimit
            }
            catch{
                throw new Error("ERROR EN LIMITPRODUCS")
            }
        }
    }

    async getProductById(id) {
        try {
            // let productoEncontrado = {}
            const fileData = await fs.promises.readFile(this.path, 'utf-8')
            let productosJson = JSON.parse(fileData)
            let productoEncontrado = productosJson.find(p => p.id === id)
            if (productoEncontrado) {
                console.log(productoEncontrado)
                return productoEncontrado
            }
            else {
                return { error: "No existe tal producto" }
            }
        }
        catch {
            throw new Error("ERROR EN PRODUCTBYID")
        }
    }
}

const manager = new ProductManager()

app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
    const limit = +req.query.limit
    const prod = await manager.getProduct(limit)
    res.send(prod)
})

app.get("/products/:prodId", async (req, res) => {
    const prodId = +req.params.prodId
    const productoId = await manager.getProductById(prodId)
    res.send(productoId)
})

app.listen(8080, () => {
    console.log("El servidor esta escuchando en el puerto 8080")
})