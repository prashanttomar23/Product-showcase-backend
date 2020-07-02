const express = require("express");
const router = express.Router();
const { Inventory } = require("../models/inventory")

router.post('/add', async (req, res) => {

    //console.log(req.body.user.name)

    let data = await Inventory.findOne({ email: req.body.user.email });
    if (data) {

        let inventoryTemp = data.inventoryItems

        if (inventoryTemp.length === 0) {
            console.log("from if 1")
            inventoryTemp.push(req.body.inventoryItem)
            let inv = await Inventory.findOneAndUpdate({ email: req.body.user.email },
                {
                    inventoryItems: inventoryTemp
                })
            res.send("OK")
        }
        else {
            //console.log("from else 1")
            for (let i = 0; i < inventoryTemp.length; i++) {
                //console.log(i, "insdie for", inventoryTemp.length)
                if (inventoryTemp[i].name === req.body.inventoryItem.name) {
                    console.log(req.body.inventoryItem.quantity, "mid", inventoryTemp[i].quantity)
                    inventoryTemp[i].quantity += req.body.inventoryItem.quantity
                    console.log("-0-----------------", inventoryTemp[i].quantity)
                    break

                }

                else if (i === inventoryTemp.length - 1) {
                    inventoryTemp.push(req.body.inventoryItem)
                    break
                    // let inv = await Inventory.findOneAndUpdate({ email: req.body.user.email },
                    //     {
                    //         inventoryItems: inventoryTemp
                    //     })
                    // res.send("OK")
                }

            };
            let inv = await Inventory.findOneAndUpdate({ email: req.body.user.email }, { inventoryItems: inventoryTemp })
            res.send("OK")
        }

    }
    else {
        console.log("inside else lasr")
        let inventory = new Inventory({
            user: req.body.user.name,
            email: req.body.user.email,
            role: req.body.user.role,
            inventoryItems: req.body.inventoryItem
        })
        //console.log(inventory)
        let inv = await inventory.save()
        res.send("OK")
    }


})
router.post('/my', async (req, res) => {
    let data = await Inventory.findOne({ email: req.body.email })
    //console.log(data)
    if (data !== null) {
        res.send(data.inventoryItems)
    }
    else {
        res.send("Not found")
    }

})

router.post('/edit', async (req, res) => {
    //console.log(req.body,"from edit")
    const inv = await Inventory.findOneAndUpdate({ email: req.body.email }, { inventoryItems: req.body.inventoryItems })
})

router.put('/delete', async (req, res) => {
    //console.log(req.body)

    const data = await Inventory.findOne({ email: req.body[0].email });
    //console.log(data)
    let inventoryTemp = data.inventoryItems
    for (i = 0; i < inventoryTemp.length; i++) {
        //console.log(req.body[0].email)
        if (inventoryTemp[i].name === req.body[0].name) {
            inventoryTemp.splice(i, 1)
            //console.log("from inside",inventoryTemp)

            break;
        }
    }
    console.log(inventoryTemp)
    let inv = await Inventory.findOneAndUpdate({ email: req.body[0].email },
        {
            inventoryItems: inventoryTemp
        })
    //console.log(inv)
    res.send("ok")
    //console.log(inventoryTemp,"this si inventr temp")

});



module.exports = router;