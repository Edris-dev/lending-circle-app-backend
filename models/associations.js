const CircleMember = require('./circlememberModel');
const User = require('./userModel');
const Circle = require('./circleModel');

//, {foreignKey: 'adminUserID'}
//, {foreignKey: 'adminUserID'}
//this if mostly for Admin
User.hasMany(Circle,{foreignKey: 'adminUserID'}); //Circle will get adminId
Circle.belongsTo(User,{foreignKey: 'adminUserID'}); //User will have adminCircleId

//Other Members
User.belongsToMany(Circle, {through: CircleMember});
Circle.belongsToMany(User, {through: CircleMember});

CircleMember.belongsTo(User)
CircleMember.belongsTo(Circle)