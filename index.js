import fs from 'fs'
import express from 'express';

const app = express()

const product1 = []

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
                        console.log(i)
                    }
                }
                return productsLimit
            }
            catch{
                throw new Error("ERROR EN LIMITPRODUCS")
            }
        }
    }

    async limitProducts(limit) {
        try {
            let products = []
            let productsLimit = []
            if (fs.existsSync(this.path)) {
                const fileData = await fs.promises.readFile(this.path, 'utf-8')
                products = JSON.parse(fileData)

                for (let i = 0; i === limit; i++){
                    productsLimit.push(products[i])
                    console.log(i)
                }
            }
            return productsLimit
        }
        catch{
            throw new Error("ERROR EN LIMITPRODUCS")
        }
    }

    async addProducts(prod) {
        try {
            const productFile = await fs.readFile(this.path, "utf-8")
            let newProduct = JSON.parse(productFile)

            const valid = newProduct.find((p) => p.id === prod.id || p.code === prod.code)

            if (valid) {
                throw new Error('ID O CODE REPETIDO, NO SE PUEDE CREAR EL OBJETO')
            }

            if (newProduct.length > 0) {
                const lastProduct = newProduct[newProduct.length - 1]
                this.idAuto = lastProduct.id + 1
            }

            newProduct.push({ id: this.idAuto++, ...prod })

            await fs.writeFile(this.path, JSON.stringify(newProduct, null, 2))
            return 'OBJETO CREADO CORRECTAMENTE'
        }
        catch (e) {
            throw new Error(e)
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
        // const productFile = await fs.promises.readFile(this.path, "utf-8")
        // let idProd = JSON.parse(productFile)

        // const buscarProd = idProd.find(p => p.id === id)

        // if(!buscarProd){
        //     throw new Error("NO SE ENCONTRO EL PRODUCTO EN LA LISTA")
        // }
        // return buscarProd
    }

    async updateProduct(id, data) {
        const productFile = await fs.readFile(this.path, "utf-8")
        let prods = JSON.parse(productFile)

        const buscarProd = prods.findIndex(p => p.id === id)
        prods.splice(buscarProd, 1, { id, ...data })

        await fs.writeFile(this.path, JSON.stringify(prods, null, 2))

        return 'PRODUCTO MODIFICADO CORRECTAMENTE'
    }

    async deleteProduct(id) {
        const productFile = await fs.readFile(this.path, "utf-8")
        let prods = JSON.parse(productFile)

        const buscarProd = prods.find(p => p.id === id)

        if (!buscarProd) {
            throw new Error("EL ID NO EXISTE")
        }

        const deletedProd = prods.filter(p => p.id !== id)

        await fs.writeFile(this.path, JSON.stringify(deletedProd, null, 2))

        return 'PRODUCTO MODIFICADO CORRECTAMENTE'
    }
}



const manager = new ProductManager()

app.use(express.urlencoded({ extended: true }))

app.get("/products", async (req, res) => {
    const limit = +req.query.limit
    console.log(limit)
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



// const pm = new ProductManager()

// const generate = async () => {
//     console.log(await pm.getProduct())
//     console.log(await pm.addProducts(product1))
//     console.log(await pm.getProductById(1))
//     console.log(await pm.updateProduct(1, {...product1, code: "MODIFICADO"}))
// }

