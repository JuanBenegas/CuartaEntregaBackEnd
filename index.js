const fs = require("fs").promises
import express from 'express';

const app = express()

const product1 = [
    {
        title: 'producto prueba',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    },
    {
        title: 'producto prueba 2',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    },
    {
        title: 'producto prueba 3',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    },
    {
        title: 'producto prueba 4',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    },
    {
        title: 'producto prueba 5',
        description:'Este es un producto prueba',
        price:200,
        thumbnail:'Sin imagen',
        code:'abc123',
        stock:25
    }
]

class ProductManager {
    idAuto = 1
    #products = []
    path = ``

    constructor(){
        this.#products = [
            {
                title: 'producto prueba',
                description:'Este es un producto prueba',
                price:200,
                thumbnail:'Sin imagen',
                code:'abc123',
                stock:25
            },
            {
                title: 'producto prueba 2',
                description:'Este es un producto prueba',
                price:200,
                thumbnail:'Sin imagen',
                code:'abc123',
                stock:25
            },
            {
                title: 'producto prueba 3',
                description:'Este es un producto prueba',
                price:200,
                thumbnail:'Sin imagen',
                code:'abc123',
                stock:25
            },
            {
                title: 'producto prueba 4',
                description:'Este es un producto prueba',
                price:200,
                thumbnail:'Sin imagen',
                code:'abc123',
                stock:25
            },
            {
                title: 'producto prueba 5',
                description:'Este es un producto prueba',
                price:200,
                thumbnail:'Sin imagen',
                code:'abc123',
                stock:25
            }
        ]
        this.path = `./products.json`
    }

    async getProduct() {
        return this.product
    }

    async addProducts(prod){
        try{
            const productFile = await fs.readFile(this.path, "utf-8")
            let newProduct = JSON.parse(productFile)
            
            const valid = newProduct.find((p) => p.id === prod.id || p.code === prod.code)

            if(valid){
                throw new Error('ID O CODE REPETIDO, NO SE PUEDE CREAR EL OBJETO')
            }

            if (newProduct.length > 0){
                const lastProduct = newProduct[newProduct.length - 1]
                this.idAuto = lastProduct.id + 1
            }

            newProduct.push({id:this.idAuto++, ...prod})

            await fs.writeFile(this.path, JSON.stringify(newProduct, null, 2))
            return 'OBJETO CREADO CORRECTAMENTE'
        }
        catch(e){
            throw new Error(e)
        }
    }

    async getProductById(id){
        const productFile = await fs.readFile(this.path, "utf-8")
        let idProd = JSON.parse(productFile)

        const buscarProd = idProd.find(p => p.id === id)

        if(!buscarProd){
            throw new Error("NO SE ENCONTRO EL PRODUCTO EN LA LISTA")
        }
        return buscarProd
    }

    async updateProduct(id, data) {
        const productFile = await fs.readFile(this.path, "utf-8")
        let prods = JSON.parse(productFile)

        const buscarProd = prods.findIndex(p => p.id === id)
        prods.splice(buscarProd, 1, {id, ...data})

        await fs.writeFile(this.path, JSON.stringify(prods, null, 2))

        return 'PRODUCTO MODIFICADO CORRECTAMENTE'
    }

    async deleteProduct(id) {
        const productFile = await fs.readFile(this.path, "utf-8")
        let prods = JSON.parse(productFile)

        const buscarProd = prods.find(p => p.id === id)

        if(!buscarProd){
            throw new Error("EL ID NO EXISTE")
        }
        
        const deletedProd = prods.filter(p => p.id !== id)

        await fs.writeFile(this.path, JSON.stringify(deletedProd, null, 2))

        return 'PRODUCTO MODIFICADO CORRECTAMENTE'
    }
}

const manager = new ProductManager()

app.get("/", (req, res) => {
    const productos = req.query.productos;
    return manager.getProduct()
})

app.listen(8081, () => {
    console.log("El servidor esta escuchando en el puerto 8083")
})



// const pm = new ProductManager()

// const generate = async () => {
//     console.log(await pm.getProduct())
//     console.log(await pm.addProducts(product1))
//     console.log(await pm.getProductById(1))
//     console.log(await pm.updateProduct(1, {...product1, code: "MODIFICADO"}))
// }

