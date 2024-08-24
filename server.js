const express = require("express")
const app = express()
const {open} = require("sqlite")
const sqlite3 =require("sqlite3")
const path = require("path")
const dbpath = path.join(__dirname,"studentsMentors.db")
app.use(express.json())
let db=null

const intializeServerAndDatabase =async () =>{
   try {
    db = await open({
        filename:dbpath,
        driver:sqlite3.Database
    })
    app.listen(3001,()=>{
        console.log("server running at port number 3001")
    })

}catch(e){
    console.log(`error message ${e.message}`)
    process.exit(1)
}
}
intializeServerAndDatabase()

app.post('/students',async(request,response)=>{
    const {student_Name,area_of_intrest,availabilty} = request.body
    const addStudentQuery=`INSERT INTO students 
    (student_Name,area_of_intrest,availabilty)
    VALUES
    (?,?,?)`
    await db.run(addStudentQuery,[student_Name,area_of_intrest,availabilty])
    try {
        response.status(200).send("student add successfully")
    }
    catch (e) {
        response.status(400).send({error : `${e.message}`})
    }
})

app.post('/mentors',async(request,response)=>{
    const {mentor_Name,availability,area_of_expert,is_premium} = request.body 
    const addMentorQuery = `INSERT INTO mentors
    (mentor_Name,availability,area_of_expert,is_premium)
    VALUES
    (?,?,?,?)`

    await db.run(addMentorQuery,[mentor_Name,availability,area_of_expert,is_premium])
    try{
        response.status(200).send('mentor add successfully')
    }catch (e){
        response.status(400).send({error:`${e.message}`})
    }
})




