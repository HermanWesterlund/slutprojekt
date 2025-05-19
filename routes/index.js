import express from "express"
import db from "../db-sqlite.js"
import { formatDistanceToNow } from "date-fns"
import bcrypt from "bcrypt"
import { body, validationResult } from 'express-validator'

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

router.get("/remember", async (req, res) => {

  if (req.session.loggedin == true) {
    res.render("remember.njk", {

    })
  }
  else {
    res.redirect("/login")
  }
})

router.get("/dunk", async (req, res) => {
  if (req.session.loggedin == true) {
    res.render("dunk.njk", {

    })
  }
  else {
    res.redirect("/login")
  }
})

router.get("/register", async (req, res) => {
  if (req.session.loggedin != true) {
    res.render("register.njk", {

    })
  }
  else {
    res.redirect("/")
  }
})

router.get("/login", async (req, res) => {
  if (req.session.loggedin != true) {
    res.render("login.njk", {

    })
  }
  else {
    res.redirect("/")
  }
})

router.post("/create", body('name').trim().notEmpty(), async (req, res) => {
  const validResult = validationResult(req);
  console.log(validResult)
  if (validResult.isEmpty()) {
    //return res.send(`Hello, ${req.query.person}!`);
    const { name, password } = req.body

    const result = await db.get('SELECT * FROM user WHERE name = ?', name)
    //res.json(result)
    console.log(result)

    if (result === undefined) {
      bcrypt.hash(password, 10, async (err, hash) => {
        const result = await db.run('INSERT INTO user (name, password) VALUES (?, ?)', name, hash)
        console.log(result)
        console.log(name)
      })
      console.log("Användare finns inte")
      return res.redirect("/")
    }
    else {
      console.log("Användare finns redan")
      return res.redirect("/register")
    }
  }
  console.log(validResult)
  res.redirect("/register")
})

router.post("/check", async (req, res) => {
  const { name, password } = req.body

  const result = await db.get('SELECT * FROM user WHERE name = ?', name)

  console.log(result)
  console.log(password)

  if (result != undefined) {
    bcrypt.compare(password, result.password, function (err, result) {
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

router.post("/logout", async (req, res) => {
  req.session.loggedin = false
  res.redirect("/login")
})

export default router
