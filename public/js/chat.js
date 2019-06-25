var socket=io();



var form=document.querySelector("#message-form");
var input1=document.querySelector("#input1");
var button1=document.querySelector("#submit");
var messages=document.querySelector("#messages");
var messageTemplate=document.querySelector("#message-template").innerHTML;
var locationMessageTemplate=document.querySelector("#location-message-template").innerHTML;
var sidebarTemplate=document.querySelector("#sidebar-template").innerHTML;

var query=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

var autoScroll=function()
{
    const element=messages.lastElementChild;
element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
}


socket.on("message",function(message)
{
    console.log(message);
    var html=Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format("h:mm a")
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoScroll();
});


socket.on("locationMessage",function(url)
{
    var html=Mustache.render(locationMessageTemplate,{
        url:url.url,
        createdAt:moment(url.createdAt).format("h:mm a")
    });
    messages.insertAdjacentHTML("beforeend",html);
     autoScroll();
})

socket.on("roomData",function(data) {
    var html=Mustache.render(sidebarTemplate,{
        room:data.room,
        users:data.users
    });
    document.querySelector("#sidebar").innerHTML=html;
})

form.addEventListener("submit",function(e)
{
    e.preventDefault();
    button1.setAttribute("disabled","disabled");
    var message=input1.value;
    socket.emit("messagefromclient",message,function(error)
    {
        button1.removeAttribute("disabled");
        input1.value="";
        input1.focus();
        if(error)
        {
            return console.log(error);
        }
        console.log("The message was delivered");
    });
});

document.querySelector("#send-location").addEventListener("click",function(){
    if(!navigator.geolocation)
    {
        return alert("Geolocation is not supported by your browser");
    }
    document.querySelector("#send-location").setAttribute("disabled","disabled");
    navigator.geolocation.getCurrentPosition(function(position)
    {
        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },function()
        {
             document.querySelector("#send-location").removeAttribute("disabled");
            console.log("Location shared");
        });
    });
});

socket.emit("join",query)