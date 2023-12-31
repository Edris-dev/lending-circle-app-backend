const User = require('../models/userModel')
const Circle = require('../models/circleModel')
const CircleMember = require('../models/circlememberModel')
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
const bcrypt = require('bcrypt')

const createUser = async (req,res)  =>{
    try{
        const {username, email,password, firstName, displayImg} = req.body;

        const newUser = await User.create({
            username,
            password,
            firstName,
            email,
            displayImg
        })

        res.status(201).json(newUser);

    }catch(err){
        console.error('Error creating user:', err);
        res.status(500).send('Internal Server Error');
    }
}
const findAll = async (req,res) => {
    try{
       const allUsers = await User.findAll({
        attributes: {exclude: ['password']}
       })

       res.status(201).json(allUsers)

    }catch(err){
        console.error('Error finding users:', err);
        res.status(500).send('Internal Server Error');
    }
}

const findUser = async (req,res) => {
    try{
        const {username} = req.params;
        const userInfo = await User.findOne({
            where:{
                username: username
            },
            attributes: {exclude: ['password','userID', 'createdAt', 'updatedAt']}
        })

        if(userInfo){
            res.status(201).json(userInfo)
        }else{
            res.status(404).send("User Does Not Exist")
        }

    }catch(err){
        console.error('Error finding user:', err);
        res.status(500).send('Internal Server Error');
    }
}

const loginUser = async (req,res) => {
    try{
        const {email, password} = req.body;
        console.log({email})
        const user = await User.findOne({where: {email}})

        console.log({user})

        if (!user || !bcrypt.compareSync(password,user.password)){
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const sanitizedUser = {
            id: user.id,
            name: user.firstName,
            email:user.email,
            displayImg:user.displayImg,
        }

        res.status(200).send(sanitizedUser)

    }catch(err){
        console.error('Error finding user:', err);
        res.status(500).send('Internal Server Error');
    }
}

const bulkMake = async (req, res) => {
    try{

        const bulkMake = User.bulkCreate(
            users.map((user) => ({
             username: user.username,
             password: user.password,
             firstName: user.firstName,
             email: user.email,
             displayImg: user.imageSrc
           }))
         )

         res.status(201).send(bulkMake)

    }catch(err){
        console.error('Error making users:', err);
        res.status(500).send('Internal Server Error - bulk');
    }
}

//return [1.ARR of Groups I'm Admin, Pending, and Active]
const userCircles = async (req,res) => {

    try{
        const {userId} = req.params;
        const pendingIds = (await CircleMember.findAll({
            where: {
                UserId : userId,
                status: ['Invited']
            },
            attributes: ['CircleId'],
            }
        )).map((circle) => circle.CircleId);

        const acceptedIds = (await CircleMember.findAll({
            where: {
                UserId : userId,
                status: ['Accepted']
            },
            attributes: ['CircleId'],
            }
        )).map((circle) => circle.CircleId);


        const PendingCircles = await Circle.findAll({
            where: {id: pendingIds},
            attributes: {exclude: ['createdAt', 'updatedAt', 'adminUserID']}
        })

        const AcceptedCircles = await Circle.findAll({
            where: {id: acceptedIds},
            attributes: {exclude: ['createdAt', 'updatedAt', 'adminUserID']}
        })

        const AdminCircles = await Circle.findAll({
            where: {adminUserID : userId},
            attributes: {exclude: ['createdAt', 'updatedAt', 'adminUserID']}}
        )

        const allCircles = {AdminCircles,PendingCircles,AcceptedCircles }
        res.status(201).send(allCircles)

    }catch(err){
        console.log({err})
        res.status(500).send('Internal Server Error');
    }

}


const userStatus = async (req,res) => {
    try{
        const {groupId, userId} = req.query;

        const status = await CircleMember.findOne({
            where: {CircleId: groupId, UserId:userId},
            attributes: ['status']
        })

        if(status){
            console.log({status})

            res.status(201).send(status.toJSON());

        }else{
            console.error('Error finding user:', err);
            res.status(500).send('Internal Server Error');
        }



    }catch(err){
        console.log({err})
    }


}

const requestMember = async (req,res) => {

    try{
        const {requestMember, userId, groupId} = req.body;
        console.log(req.body)

        const newUser = await User.findOne({
            where: {username:requestMember},
            attributes: ['id']
        })

        console.log({newUser})

        if(!newUser){
            res.status(404).json("Error: User does not exist")
            return
        }

        const existingMember = await CircleMember.findOne({
            where: {UserId: newUser.id, CircleId: groupId},
        })

        if(existingMember ){
            //has already been invited or is a member
            res.status(404).json("Error: User is already member of group")
            return
        }

        console.log("Need to figure myself out")

        const currentMember = await CircleMember.findOne({
            where: {UserId: userId, CircleId:groupId}
        })

        console.log({currentMember})

        if(!currentMember){

            res.status(404).json("Error: You are not part of this group - cannot make requests")
        }else if (currentMember.status === 'Admin'){
            //if admin making request no need to request admin to approve
            console.log("Why hello")
            await CircleMember.create({
                CircleId: groupId,
                UserId: newUser.id,
                status: 'Invited',
            })
            res.status(200).json("Success! Invited User to Circle")

        }else{

            await CircleMember.create({
                CircleId: groupId,
                UserId: newUser.id,
                status: 'Requested',
            })
            res.status(200).json("Success! Requested Admin to Add User")

        }

        console.log({newUserId})






        console.log({newUserId})



    }catch{

    }
    //find if requested user exist -> see if they exist already in this group
    //if not then unless person who requested is the admin of the group then add Requested Tag
    //otherwise if its Admin add 'Invited a=tag'
}




module.exports = {createUser,
    findAll, findUser
    ,bulkMake,loginUser,
    userCircles, userStatus,
    requestMember}