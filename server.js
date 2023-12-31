const express = require('express');
const cors = require("cors");
const app = express();

const sequelize = require('./config/database')
require('./models/associations')

const userRoutes = require('./routes/userRoutes');
const User = require('./models/userModel');

const circleRoutes = require('./routes/circleRoutes');
const Circle = require('./models/circleModel');
const CircleMember = require('./models/circlememberModel');

/*
id: number (unique identifier for the user)
username: string (username of the user)
email: string (email of the user)
firstName: string (first name of the user)
lastName: string (last name of the user)
imageSrc: string (URL to the user's profile image)
emailOrSms: string (preferred mode of communication, e.g., "email" or "sms")
groups: array of objects (groups the user is part of)
    groupId: number (unique identifier of the group)
    role: string (role of the user in the group, e.g., "admin", "member", "pending") */


const users = [
    {
      "id":1,
      "username": "coolguy123",
      "password":'123',
      "firstName": "John",
      "lastName": "Doe",
      "imageSrc": "https://robohash.org/coolguy123",
      "emailOrSms": "email",
      "email": "john@doe.com",
      "groups": {
        "admin": [],
        "pending": [],
        "accepted": [],
        "declined": [],
      },
    },
    {
      "id":2,
      "username": "soccerstar55",
      "password":'123',
      "firstName": "Emily",
      "lastName": "Smith",
      "imageSrc": "https://robohash.org/soccerstar55",
      "emailOrSms": "email",
      "email": "emily@smith.com",
      "groups": {
        "admin": [],
        "pending": [],
        "accepted": [],
        "declined": [],
      },

    },
    {
      "id":3,
      "username": "gamer99",
      "password":'123',
      "firstName": "Michael",
      "lastName": "Johnson",
      "imageSrc": "https://robohash.org/gamer99",
      "emailOrSms": "email",
      "email": "Michael@Johnson.com",
      "groups": {
        "admin": [],
        "pending": [],
        "accepted": [],
        "declined": [],
      },

    },
    {
      "id":4,
      "username": "artsygirl",
      "password":'123',
      "firstName": "Sarah",
      "lastName": "Lee",
      "imageSrc": "https://robohash.org/artsygirl",
      "emailOrSms": "email",
      "email": "Sarah@Lee.com",
      "groups": {
        "admin": [],
        "pending": [],
        "accepted": [],
        "declined": [],
      },

    }
];

const groups = new Map();

// parse application/json
app.use(express.json())
app.use(express.urlencoded({extended: true}));
app.use(cors())
/*


//

app.get('/groups', showGroups);

//app.get('/users/my-circles/:id', myGroups);

//app.post('/users/:groupId', groupRequest); */

app.use('/users',userRoutes)
app.use('/circles/', circleRoutes)

function groupRequest(req,res,err){
  const {groupId,userId,status} = req.body;

  console.log(req.body)
  console.log({status})


  let circle = getGroup(groupId);
  if(!circle){
    res.status(404).json("No such circle ")
    return
  }


 deleteGroupfromUser(userId,groupId)
 addGroupToUser(userId, groupId, status)


  const pendingArr = circle.participants.pending
  const index = pendingArr.indexOf(userId);
    if (index > -1) {
      pendingArr.splice(index, 1);
    }else{
      res.status(404).json("No such user ")
      return
    }



  if( status === 'declined'){
    //move user out of group "pending" into "declined"
    circle.participants.declined.push(userId)

  }else if( status === 'accepted'){
        //move user out of group "pending" into "declined"
        console.log("YELLLO")
        circle.participants.accepted.push(userId)

        console.log({circle})
  }else{
    res.status(404).json("Bad status ")

  }



  res.status(200).json("Great success")





}



function updateRelationship(groupId, userId, status){

  if (userData) {
    userObj[status].push(groupId)
  }

}
function deleteGroupfromUser(userId, groupId){

  let userData = users.find((user) => user.id === userId);

  if (userData) {
    let pendingArr = userData.groups.pending

    const index = pendingArr.indexOf(groupId);
    if (index > -1) {
      pendingArr.splice(index, 1);
    }
  }

}

const port = 3000 || process.env.PORT ;


sequelize.sync().then(() =>{
  /*User.bulkCreate(
    users.map((user) => ({
     username: user.username,
     password: user.password,
     firstName: user.firstName,
     email: user.email,
     displayImg: user.imageSrc
   })));*/


  app.listen(port, () => {
    console.log(`Server is now listening at port ${port}`);
  });
}).catch((err) => {
  console.log({err})
})


