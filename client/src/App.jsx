import React, { useState,useEffect } from "react";
import sengimg from "./assets/send.svg";
import user from "./assets/user.png";
import loadingIcon from "./assets/loader.svg";
import bot from "./assets/bot.png";
import axios from "axios"

// const arr = [{
//     type : "bot" , post : "dfdfdfdf"
// },{
//   type : "user" , post : "dfdhghghfdfdf"
// }]


function App() {
  const [input, setInput] = useState("");
  const [posts, setposts] = useState([]);


  useEffect(()=>{
      document.querySelector(".layout").scrollTop =       document.querySelector(".layout").scrollHeight

  } , [posts])

const fetchBotResponse = async()=>{
    const {data} = await axios.post("http://localhost:4000" , {input},
    { headers : {"Content-Type" : "application/json"}}
    );
    return data;

}



const onSubmit = ()=>{

  if(input.trim()==="") return;
  updatePosts(input);
  updatePosts("Loading..." , false,true);
  setInput("");

  fetchBotResponse().then((res)=> {
    updatePosts(res.bot.trim(), true);

  })

}

const autoTypingBotResponse = (text)=>{
        let index = 0;
        let interval = setInterval(()=>{
            if(index < text.length){
              setposts(prevState => {
              let lastItem = prevState.pop();
              if(lastItem.type !== "bot"){
                prevState.push({
                  type : "bot",
                  post : text.charAt(index-1)
                })

              }else{
                prevState.push({
                  type : "bot",
                  post : lastItem.post + text.charAt(index-1)
                })
              }
              return [...prevState]

              })
              index++;
            }
            else{
              clearInterval(interval)
            }
        },30)

}



const updatePosts = (post , isBot , isLoading)=>{
  if(isBot){
      autoTypingBotResponse(post);
  }  else{
    setposts(prevState => {
      return [
        ...prevState ,{type : isLoading ? "loading" : "user" ,post}
      ]
    })
  }
  
 
}

const onKeyUp = (e)=>{
  if(e.key === "Enter" || e.which === 13){
    onSubmit();
  }


}





  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            <div key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                  alt="image"
                />
              </div>
              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loadingIcon} alt="load" />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>
      <footer>
        <input
          value={input}
          type="text"
          className="composebar"
          placeholder="Ask Anything"
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
          autoFocus
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={sengimg} alt="send" />
        </div>
      </footer>
    </main>
  );
}

export default App;
