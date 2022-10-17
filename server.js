var app = require("http");
const {Telegraf} = require('telegraf');
const {createClient} = require("pexels");
var log = "Server Starterd<br>";
const bot = new Telegraf('1987734218:AAHbYqUZHC6TyQ6BFQUD7yHyDE2J3EezN5g');
const client = createClient("563492ad6f9170000100000180092ddff19245919524cf1a64cbfa4a");

bot.command("start",ctx=>{
    log += ctx.from.username+" is Started Bot<br>";
    let message = "Hello "+ctx.from.username+" 😃 \n";
    message += "Here is the Command List \n /photo : \t You can Search Photos \n";
    message += "/video : \t You Can Search Videos";
    bot.telegram.sendMessage(ctx.chat.id,message ,{
    });
})
bot.command('poll', ctx=>{
    log += ctx.from.username+" is Created a Poll<br>";
    bot.telegram.sendPoll(ctx.chat.id,"What is Your Gender?",["Male","Female"]);
})
bot.command("photo",ctx=>{
    bot.telegram.sendMessage(ctx.chat.id,"Enter Search Query : ",{});
    bot.on('text',async(ctx)=>{
        let query = ctx.message.text;
        log += ctx.from.username+" is Requested a Photo (Query : "+query+") <br>";
        client.photos.search({query,per_page:5}).then(photos=>{
            if(photos.total_results > 0){
                photos.photos.forEach(element => {
                    bot.telegram.sendPhoto(ctx.chat.id,element['url'],{
                        caption:"Photo by : "+element['photographer']+"\n"+"Image Description : "+element['alt'],
                        reply_to_message_id:ctx.message.message_id
                    });
                });
                process.once('SIGINT', () => bot.stop('SIGINT'));
                process.once('SIGTERM', () => bot.stop('SIGTERM'));
            }else {
                bot.telegram.sendMessage(ctx.chat.id,"No results Found related "+query,{reply_to_message_id:ctx.message.message_id})
                process.once('SIGINT', () => bot.stop('SIGINT'));
                process.once('SIGTERM', () => bot.stop('SIGTERM'));
            }
        })
        
    })
})
bot.command("video",ctx=>{
    bot.telegram.sendMessage(ctx.chat.id,"Enter Search Query : ",{});
    bot.on('text',ctx=>{
        let query = ctx.message.text;
        client.videos.search({query,per_page:4}).then(videos=>{
            if(videos.total_results > 0){
                videos.videos.forEach(element=>{
                    bot.telegram.sendVideo(ctx.chat.id,element['video_files'][0]['link'],{
                        caption:"Video By : "+element['user']['name']+"\n"+"Pexels.com ",
                        reply_to_message_id:ctx.message.message_id
                    })
                })
                process.once('SIGINT', () => bot.stop('SIGINT'));
                process.once('SIGTERM', () => bot.stop('SIGTERM'));
            }else{
                bot.telegram.sendMessage(ctx.chat.id,"No Results Found Related "+query,{
                    reply_to_message_id:ctx.message.message_id
                })
                process.once('SIGINT', () => bot.stop('SIGINT'));
                process.once('SIGTERM', () => bot.stop('SIGTERM'));
            }
        })
    })
})

bot.launch();

var html = '';
app.createServer(function(req,res){
    res.writeHead(200,{"Content-Type": "text/html"});
    res.end(log);
}).listen(8080);
console.log("Server Running");