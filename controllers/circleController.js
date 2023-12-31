const { where } = require('sequelize');
const Circle = require('../models/circleModel');
const CircleMember = require('../models/circlememberModel');
const User = require('../models/userModel')

const createCircle = async (req,res)  =>{
    try{
        const {title,
            description,
            monthlyContribution,
            nextPayout,
            adminId,
            memberUserIDs,
            minMembers,
            maxMembers,
            isPrivate,
        } = req.body.circle;

        console.log(req.body.circle)


        const admin = await User.findByPk(adminId);

        if(!admin){
            return res.status(404).send('Error: Admin does not exist')
        }

        //create circle
        const newCircle = await Circle.create({
            title,
            description,
            monthlyContribution,
            nextPayout,
            adminUserID: admin.id,
            minMembers,
            maxMembers,
            isPrivate
        })

        //create membership table for admin
        await CircleMember.create({
            CircleId: newCircle.id,
            UserId: admin.id,
            status:'Admin',
        })

        console.log({memberUserIDs })

        if (memberUserIDs && memberUserIDs.length > 0) {
            await CircleMember.bulkCreate(
              memberUserIDs.map((members) => ({
                CircleId: newCircle.id,
                UserId: members.id,
              }))
            );
          }


        res.status(201).json(newCircle);

    }catch(err){
        console.error('Error creating circle:', err);
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

const getGroupData = async (req,res) => {
    try{
        const {groupId} = req.params;

        const group = await Circle.findByPk(parseInt(groupId));

        if(!group){
            res.status(404).send('Error: Group does not exists')
        }else{
            const members = await getCircleMembers(groupId)
            res.status(201).json({group, members})
        }

    }catch(err){
       // console.error('Error finding circle:', err);
        res.status(500).send('Internal Server Error');
    }
}

const getCircleMembers = async (groupId) =>{

    try{
        const memberStatus = await CircleMember.findAll({
            where:{ CircleId: groupId},
            include: [
                {
                model: User,
                attributes: ['id', 'firstName', 'displayImg']
                },
            ],
            attributes: ['status'],
        })
        return memberStatus

    }catch(err){
        console.error('Error finding relationships:', err);
    }

}

const memberResponse = async (req,res) => {
    try{
        const {userId,id,decision} = req.body;

        const membership = await CircleMember.findOne({
            where:{
                UserId: userId,
                CircleId: id,
            },
            attributes: ['id','status']
        })

        if(membership){
            await membership.update({status: decision})
            await membership.save()
            console.log('Update successful:', membership.toJSON());
            res.status(200).json("Update successful");
        }else{
            console.log('CircleMember not found');
            res.status(404).json("CircleMember not found");
        }

    }catch(err){
        console.error('Error finding relationships:', err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {createCircle,
     findAll,
    findUser,
    getGroupData,
    memberResponse}