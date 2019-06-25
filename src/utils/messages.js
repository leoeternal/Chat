

var generateMessage=function(text)
{
    return {
        text:text,
        createdAt:new Date().getTime()
    }
}

var generateLocationMessage=function(url)
{
    return {
        url:url,
        createdAt:new Date().getTime()
    }
}


module.exports={
    generateMessage:generateMessage,
    generateLocationMessage:generateLocationMessage
}