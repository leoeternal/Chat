var users=[];

var addUser=function(info)
{
    var username,room;
    username=info.username.trim().toLowerCase();
    room=info.room.trim().toLowerCase();
    
    if(!username||!room)
    {
        return {
            error:"Username and Room are required"
        }
    }
    
    var existinguser=users.find(function(user)
    {
        return user.room===room && user.username===username  
    });
    
    if(existinguser)
    {
        return {
            error:"username is in use"
        }
    }
    
    var user={
        username:username,
        id:info.id,
        room:room
    }
    users.push(user);
}

var removeUser=function(id)
{
    var index=users.findIndex(function(user)
    {
        return user.id===id
    });
    
    if(index!==-1)
    {
        return users.splice(index,1)[0]
    }
}

var getUser=function(id)
{
    return users.find(function(user)
    {
        return user.id===id
    })
}
 
var getUsersInRoom=function(room)
{
    var room=room.trim().toLowerCase();
    return users.filter(function(user)
    {
        return user.room===room
    })
}



module.exports={
    addUser:addUser,
    removeUser:removeUser,
    getUser:getUser,
    getUsersInRoom:getUsersInRoom
}