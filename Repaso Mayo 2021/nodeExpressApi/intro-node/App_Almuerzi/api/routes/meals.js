const express = require('express')
const meals = require('../models/meals')
const app = express()
const router = express.Router()


// router.get('/',(req,res) => {
//     res.send('Get meals...')
// })


router.get('/', (req,res) => {
    meals.find()
    .exec()
    .then(x => res.status(200).send(x))
    
})

router.get('/:id', (req,res) => {
    meals.findById(req.params.id)
    .exec()
    .then(x => res.status(200).send(x))
    
})

router.post('/', (req, res) => {
    meals.create(req.body)
    .then(x => res.status(201).send(x))
})

router.put('/:id', (req, res) => {
    meals.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.sendStatus(204))
    
})


router.delete('/:id', (req,res) => {
    meals.findByIdAndRemove(req.params.id)
    .exec()
    .then(() => res.sendStatus(204))
    
})
module.exports = router

