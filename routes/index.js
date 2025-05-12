import express from "express"
import db from "../db-sqlite.js"
import { formatDistanceToNow } from "date-fns"
import bcrypt from "bcrypt"

const router = express.Router()

router.get("/", async (req, res) => {
   
    if (req.session.loggedin == true) {
      res.render("index.njk", {

      })
    }
    else {
      res.redirect("/login")
    }
})

router.get("/burgrik", async (req, res) => {

  if (req.session.loggedin == true) {
    res.render("burgrik.njk", {

    })
  }
  else {
    res.redirect("/login")
  }
})

router.get("/remember", async (req,res) => {
  
  if (req.session.loggedin == true) {
    res.render("remember.njk", {

    })
  }
  else {
    res.redirect("/login")
  }
})

router.get("/dunk", async (req,res) => {
  if (req.session.loggedin == true) {
    res.render("dunk.njk", {

    })
  }
  else {
    res.redirect("/login")
  }
})

router.get("/register", async (req, res) => {
    res.render("register.njk")
})

router.get("/login", async (req, res) => {
    res.render("login.njk")
})

router.post("/create", async (req, res) => {
    const {name, password} = req.body
  
    const result = await db.get('SELECT * FROM user WHERE name = ?', name)
    //res.json(result)
    console.log(result)

    if (result === undefined) {
        bcrypt.hash(password, 10, async(err, hash) => {
            const result = await db.run('INSERT INTO user (name, password) VALUES (?, ?)', name, hash)
            console.log(result)
            })
            console.log("Användare finns inte")
            res.redirect("/")   
    }
    else{
        console.log("Användare finns redan")
        res.redirect("/register")
    }


    // if (result == "") {
    //     bcrypt.hash(password, 10, async(err, hash) => {
    //     const result = await db.run('INSERT INTO user (name, password) VALUES (?, ?)', name, hash)
    //     console.log(result)
    //     })
    //     res.redirect("/")
    //     console.log("JAAAAAAAAAAAAAA")
    // }
    // else {
    //     res.redirect("/")
    //     console.log("NEEEEEEEEEEEEEJ")
    // }
})

router.post("/check", async (req, res) => {
    const {name, password} = req.body
  
    const result = await db.get('SELECT * FROM user WHERE name = ?', name)
  
    console.log(result)
    console.log(password)
  
    if (result != undefined) {
      bcrypt.compare(password, result.password , function(err, result) {
        if (result == true) {
          console.log("Rätt")
          req.session.loggedin = true
          console.log(req.session.loggedin)
          res.redirect("/")
        }
        else {
          req.session.loggedin = false
          console.log("Fel")
          res.redirect("/login")
        }
      })
    }
    else {
      req.session.loggedin = false
      console.log("Fel")
      res.redirect("/login")
    }
  })

export default router
