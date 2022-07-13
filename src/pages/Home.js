import React,{useState} from 'react';
import './Home.css'
import uuid from 'react-uuid'
import toast from 'react-hot-toast';


const Home = () => {
  const [RoomId, SetRoomId] = useState('');
  const [username,setusername]=useState('');
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuid()
    SetRoomId(id);
     toast.success('Created a new room');
  };
  return (

    <div class="container">
      <div class="screen">
        <div class="screen__content">
          <form class="login">
            <div class="login__field">
              <input type="text" class="login__input" placeholder="ROOM ID"
              onChange={(e)=>SetRoomId(e.target.value)}
              value={RoomId} 
              />
            </div>  
            <div class="login__field">
              <input type="text" class="login__input" placeholder="Name" 
                onChange={(e) => setusername(e.target.value)}
                value={username} />
            </div>

            <button class="button login__submit">
              <span class="button__text">Log In </span>
              <i class="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
          <span className="createInfo">
            If you don't have an invite then create
            <br />
            &nbsp; &nbsp;&nbsp; &nbsp;
            <a
              onClick={createNewRoom}
              href=""
              className="createNewBtn"
            >
              new room
            </a>
          </span>
        </div>
        <div class="screen__background">
          <span class="screen__background__shape screen__background__shape4"></span>
          <span class="screen__background__shape screen__background__shape3"></span>
          <span class="screen__background__shape screen__background__shape2"></span>
          <span class="screen__background__shape screen__background__shape1"></span>

        </div>
        <footer>
          <h4>
            Built with 💛 &nbsp; by &nbsp;
            <a href="https://github.com/codersgyan">Coder's Gyan</a>
          </h4>
        </footer>
      </div>
    </div>
  )
}

export default Home